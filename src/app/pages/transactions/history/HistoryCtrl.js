(function () {
    'use strict';

    angular.module('BlurAdmin.pages.transactions.history')
        .controller('HistoryCtrl', HistoryCtrl);

    /** @ngInject */
    function HistoryCtrl($scope,environmentConfig,$http,cookieManagement,$uibModal,sharedResources,
                         errorHandler,$state,$window,typeaheadService,$filter,serializeFiltersService) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
        vm.currenciesList = JSON.parse($window.sessionStorage.currenciesList || '[]');
        $scope.showingFilters = true;

        $scope.pagination = {
            itemsPerPage: 26,
            pageNo: 1,
            maxSize: 5
        };

        $scope.searchParams = {
            searchId: $state.params.transactionId || null,
            searchUser: $state.params.code || null,
            searchDateFrom: null,
            searchDateTo: null,
            searchType: 'Type',
            searchStatus: 'Status',
            searchCurrency: {},
            searchOrderBy: 'Latest',
            searchSubType: ''
        };

        $scope.transactions = [];
        $scope.transactionsStateMessage = '';
        $scope.transactionsData = {};
        $scope.loadingTransactions = false;
        $scope.typeOptions = ['Type','Credit','Debit']; //Transfer
        $scope.statusOptions = ['Status','Pending','Complete','Failed','Deleted'];
        $scope.currencyOptions = [];
        $scope.orderByOptions = ['Latest','Largest','Smallest'];

        sharedResources.getSubtypes().then(function (res) {
            $scope.subtypeOptions = _.pluck(res.data.data,'name');
            $scope.subtypeOptions.unshift('');
        });

        //for angular datepicker
        $scope.dateObj = {};
        $scope.dateObj.format = 'MM/dd/yyyy';
        $scope.popup1 = {};
        $scope.open1 = function() {
            $scope.popup1.opened = true;
        };

        $scope.popup2 = {};
        $scope.open2 = function() {
            $scope.popup2.opened = true;
        };

        $scope.getFileName = $filter('date')(Date.now(),'mediumDate') + ' ' + $filter('date')(Date.now(),'shortTime') + '-transactionsHistory.csv';

        $scope.getHeader = function () {return ["Id", "User","Balance","Type","Currency", "Amount",
            "Fee","Subtype","Account","Status","Date","Reference","Note","Metadata"]};

        $scope.getCSVArray = function () {
            var array = [];
            $scope.transactions.forEach(function (element) {
                var metadata = '';
                if(typeof element.metadata === 'object' && element.metadata && Object.keys(element.metadata).length > 0){
                    metadata = JSON.stringify(element.metadata);
                } else if (typeof element.metadata === 'string'){
                    metadata = element.metadata;
                } else {
                    metadata = null;
                }
                array.push({
                    Id: element.id,
                    user: element.user.email,
                    balance: $filter('currencyModifiersFilter')(element.balance,element.currency.divisibility).toString(),
                    type: $filter('capitalizeWord')(element.tx_type),
                    currency: element.currency.code,
                    amount: $filter('currencyModifiersFilter')(element.amount,element.currency.divisibility).toString(),
                    fee: $filter('currencyModifiersFilter')(element.fee,element.currency.divisibility).toString(),
                    subtype: element.subtype,
                    account: element.account,
                    status: element.status,
                    date: $filter('date')(element.created,'mediumDate') + ' ' +$filter('date')(element.created,'shortTime'),
                    reference: element.reference,
                    note: element.note,
                    metadata: metadata
                });
            });

            return array;
        };

        $scope.showFilters = function () {
            $scope.showingFilters = !$scope.showingFilters;
        };

        $scope.orderByFunction = function () {
            return ($scope.searchParams.searchOrderBy == 'Latest' ? '-created' : $scope.searchParams.searchOrderBy == 'Largest' ? '-amount' : $scope.searchParams.searchOrderBy == 'Smallest' ? 'amount' : '');
        };

        $scope.pageSizeChanged =  function () {
            if($scope.pagination.itemsPerPage > 250){
                $scope.pagination.itemsPerPage = 250;
            }
        };

        vm.getCompanyCurrencies = function(){
            //adding currency as default value in both results array and ng-model of currency
            vm.currenciesList.splice(0,0,{code: 'Currency'});
            $scope.searchParams.searchCurrency.code = 'Currency';
            $scope.currencyOptions = vm.currenciesList;
        };
        vm.getCompanyCurrencies();

        if($state.params.currencyCode){
            vm.currenciesList.forEach(function (element) {
                if(element.code == $state.params.currencyCode){
                    $scope.searchParams.searchCurrency = element;
                }
            });
        }

        $scope.pageSizeChanged =  function () {
            if($scope.pagination.itemsPerPage > 250){
                $scope.pagination.itemsPerPage = 250;
            }
        };
        
        $scope.clearFilters = function () {
            $scope.searchParams = {
                searchId: null,
                searchUser: null,
                searchDateFrom: null,
                searchDateTo: null,
                searchType: 'Type',
                searchStatus: 'Status',
                searchCurrency: {code: 'Currency'},
                searchOrderBy: 'Latest',
                searchSubType: ''
            };
        };

        vm.getTransactionUrl = function(){

            var searchObj = {
                page: $scope.pagination.pageNo,
                page_size: $scope.pagination.itemsPerPage || 1,
                created__gt: $scope.searchParams.searchDateFrom ? Date.parse($scope.searchParams.searchDateFrom + 'T00:00:00'): null,
                created__lt: $scope.searchParams.searchDateTo? Date.parse($scope.searchParams.searchDateTo + 'T00:00:00'): null,
                currency: ($scope.searchParams.searchCurrency.code ? ($scope.searchParams.searchCurrency.code == 'Currency' ? null: $scope.searchParams.searchCurrency.code): null),
                user: ($scope.searchParams.searchUser ? encodeURIComponent($scope.searchParams.searchUser) : null),
                orderby: ($scope.searchParams.searchOrderBy == 'Latest' ? '-created' : $scope.searchParams.searchOrderBy == 'Largest' ? '-amount' : $scope.searchParams.searchOrderBy == 'Smallest' ? 'amount' : null),
                id: $scope.searchParams.searchId ? encodeURIComponent($scope.searchParams.searchId) : null,
                tx_type: ($scope.searchParams.searchType == 'Type' ? null : $scope.searchParams.searchType.toLowerCase()),
                status: ($scope.searchParams.searchStatus == 'Status' ? null : $scope.searchParams.searchStatus),
                subtype: $scope.searchParams.searchSubType ? $scope.searchParams.searchSubType: null
            };

            return environmentConfig.API + '/admin/transactions/?' + serializeFiltersService.serializeFilters(searchObj);
        };

        $scope.getLatestTransactions = function(applyFilter){
            if(vm.token) {
                $scope.transactionsStateMessage = '';
                $scope.loadingTransactions = true;

                if (applyFilter) {
                    // if function is called from history-filters directive, then pageNo set to 1
                    $scope.pagination.pageNo = 1;
                }

                if ($scope.transactions.length > 0) {
                    $scope.transactions.length = 0;
                }

                var transactionsUrl = vm.getTransactionUrl();

                $http.get(transactionsUrl, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingTransactions = false;
                    if (res.status === 200) {
                        $scope.transactionsData = res.data.data;
                        $scope.transactions = $scope.transactionsData.results;
                        if ($scope.transactions == 0) {
                            $scope.transactionsStateMessage = 'No transactions have been made';
                            return;
                        }

                        $scope.transactionsStateMessage = '';
                    }
                }).catch(function (error) {
                    $scope.loadingTransactions = false;
                    $scope.transactionsStateMessage = 'Failed to load data';
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        $scope.getLatestTransactions();

        $scope.getUsersEmailTypeahead = typeaheadService.getUsersEmailTypeahead();

        $scope.openModal = function (page, size,transaction) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'historyModalCtrl',
                resolve: {
                    transaction: function () {
                        return transaction;
                    }
                }
            });

            vm.theModal.result.then(function(transaction){
                if(transaction){
                    $scope.searchParams = {
                        searchId: null,
                        searchUser: $state.params.code || null,
                        searchDateFrom: null,
                        searchDateTo: null,
                        searchType: 'Type',
                        searchStatus: 'Status',
                        searchCurrency: {code: 'Currency'},
                        searchOrderBy: 'Latest',
                        searchSubType: ''
                    };
                    $scope.getLatestTransactions();
                }
            }, function(){
            });
        };

    }
})();
