(function () {
    'use strict';

    angular.module('BlurAdmin.pages.userDetails')
        .controller('LastTransactionsCtrl', LastTransactionsCtrl);

    /** @ngInject */
    function LastTransactionsCtrl($scope,environmentConfig,$http,cookieManagement,$stateParams,
                                  $uibModal,errorHandler,$state,$window) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
        vm.currenciesList = JSON.parse($window.sessionStorage.currenciesList || '[]');
        vm.uuid = $stateParams.uuid;
        $scope.transactionsStateMessage = '';
        $scope.userTransactions = [];

        $scope.pagination = {
            itemsPerPage: 10,
            pageNo: 1,
            maxSize: 5
        };

        $scope.searchParams = {
            searchId: $state.params.transactionId || '',
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
        $scope.loadingLastTransactions = false;
        $scope.typeOptions = ['Type','Credit','Debit']; //Transfer
        $scope.transactionStatusOptions = ['Status','Initiating','Processing','Pending','Complete','Failed'];
        $scope.lastTransactionsCurrencyOptions = [];
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

        vm.getCompanyCurrencies = function(){
            //adding currency as default value in both results array and ng-model of currency
            vm.currenciesList.splice(0,0,{code: 'Currency'});
            $scope.searchParams.searchCurrency.code = 'Currency';
            $scope.lastTransactionsCurrencyOptions = vm.currenciesList;
        };
        vm.getCompanyCurrencies();

        $scope.pageSizeChanged =  function () {
            if($scope.pagination.itemsPerPage > 250){
                $scope.pagination.itemsPerPage = 250;
            }
        };

        vm.getTransactionUrl = function(){

            vm.filterParams = '&page=' + $scope.pagination.pageNo + '&page_size=' + $scope.pagination.itemsPerPage
                + '&created__gt=' + ($scope.searchParams.searchDateFrom? Date.parse($scope.searchParams.searchDateFrom) : '')
                + '&created__lt=' + ($scope.searchParams.searchDateTo? Date.parse($scope.searchParams.searchDateTo) : '')
                + '&currency=' + ($scope.searchParams.searchCurrency.code ? ($scope.searchParams.searchCurrency.code == 'Currency' ? '' : $scope.searchParams.searchCurrency.code) : '')
                + '&orderby=' + ($scope.searchParams.searchOrderBy == 'Latest' ? '-created' : $scope.searchParams.searchOrderBy == 'Largest' ? '-amount' : $scope.searchParams.searchOrderBy == 'Smallest' ? 'amount' : '')
                + '&id=' + $scope.searchParams.searchId
                + '&tx_type=' + ($scope.searchParams.searchType == 'Type' ? '' : $scope.searchParams.searchType.toLowerCase())
                + '&status=' + ($scope.searchParams.searchStatus == 'Status' ? '' : $scope.searchParams.searchStatus.toLowerCase())
                + '&subtype=' + $scope.searchParams.searchSubType; // all the params of the filtering

            return environmentConfig.API + '/admin/transactions/?user=' + vm.uuid +  vm.filterParams;
        };

        $scope.getUserTransactions = function(applyFilter){

            $scope.transactionsStateMessage = '';
            $scope.loadingLastTransactions = true;

            if (applyFilter) {
                // if function is called from filters directive, then pageNo set to 1
                $scope.pagination.pageNo = 1;
            }

            if ($scope.userTransactions.length > 0) {
                $scope.userTransactions.length = 0;
            }

            var transactionsUrl = vm.getTransactionUrl();

            if(vm.token) {
                $scope.loadingLastTransactions = true;
                $http.get(transactionsUrl, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingLastTransactions = false;
                    if (res.status === 200) {
                        $scope.userTransactionsData = res.data.data;
                        $scope.userTransactions = res.data.data.results;
                        if ($scope.userTransactions == 0) {
                            $scope.transactionsStateMessage = 'No transactions have been made';
                            return;
                        }

                        $scope.transactionsStateMessage = '';
                    }
                }).catch(function (error) {
                    $scope.loadingLastTransactions = false;
                    $scope.transactionsStateMessage = 'Failed to load data';
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        $scope.getUserTransactions();

        $scope.openModal = function (page, size,transaction) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'LastTransactionsModalCtrl',
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
                        searchDateFrom: '',
                        searchDateTo: '',
                        searchType: 'Type',
                        searchStatus: 'Status',
                        searchCurrency: {code: 'Currency'},
                        searchOrderBy: 'Latest',
                        searchSubType: ''
                    };

                    $scope.getUserTransactions();
                }
            }, function(){
            });
        };

    }
})();

