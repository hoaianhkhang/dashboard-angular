(function () {
    'use strict';

    angular.module('BlurAdmin.pages.transactions.history')
        .controller('HistoryCtrl', HistoryCtrl);

    /** @ngInject */
    function HistoryCtrl($scope,environmentConfig,$http,cookieManagement,$uibModal,errorHandler,$state,$window,typeaheadService) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
        vm.currenciesList = JSON.parse($window.sessionStorage.currenciesList || '[]');

        $scope.pagination = {
            itemsPerPage: 26,
            pageNo: 1,
            maxSize: 5
        };

        $scope.searchParams = {
            searchId: $state.params.transactionId || '',
            searchUser: $state.params.code || '',
            searchDateFrom: '',
            searchDateTo: '',
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
        $scope.statusOptions = ['Status','Initiating','Processing','Pending','Complete','Failed'];
        $scope.currencyOptions = [];
        $scope.orderByOptions = ['Largest','Latest','Smallest'];

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
                if(element.code ==  $state.params.currencyCode){
                    $scope.searchParams.searchCurrency = element;
                }
            });
        }

        vm.getTransactionUrl = function(){

            vm.filterParams = '?page=' + $scope.pagination.pageNo + '&page_size=' + $scope.pagination.itemsPerPage
                + '&created__gt=' + ($scope.searchParams.searchDateFrom? Date.parse($scope.searchParams.searchDateFrom) : '')
                + '&created__lt=' + ($scope.searchParams.searchDateTo? Date.parse($scope.searchParams.searchDateTo) : '')
                + '&currency=' + ($scope.searchParams.searchCurrency.code ? ($scope.searchParams.searchCurrency.code == 'Currency' ? '' : $scope.searchParams.searchCurrency.code) : '')
                + '&user=' + ($scope.searchParams.searchUser ? encodeURIComponent($scope.searchParams.searchUser) : '')
                + '&orderby=' + ($scope.searchParams.searchOrderBy == 'Latest' ? '-created' : $scope.searchParams.searchOrderBy == 'Largest' ? '-amount' : $scope.searchParams.searchOrderBy == 'Smallest' ? 'amount' : '')
                + '&id=' + $scope.searchParams.searchId
                + '&tx_type=' + ($scope.searchParams.searchType == 'Type' ? '' : $scope.searchParams.searchType.toLowerCase())
                + '&status=' + ($scope.searchParams.searchStatus == 'Status' ? '' : $scope.searchParams.searchStatus)
                + '&subtype=' + $scope.searchParams.searchSubType; // all the params of the filtering

            return environmentConfig.API + '/admin/transactions/' + vm.filterParams;
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
                        searchId: '',
                        searchUser: $state.params.code || '',
                        searchDateFrom: '',
                        searchDateTo: '',
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
