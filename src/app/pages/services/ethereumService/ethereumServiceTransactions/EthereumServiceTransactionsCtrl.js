(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.ethereumService.ethereumServiceTransactions')
        .controller('EthereumServiceTransactionsCtrl', EthereumServiceTransactionsCtrl);

    /** @ngInject */
    function EthereumServiceTransactionsCtrl($scope,$http,cookieManagement,$uibModal,errorHandler,$window,$location) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
        vm.currenciesList = JSON.parse($window.sessionStorage.currenciesList);

        $scope.pagination = {
            itemsPerPage: 26,
            pageNo: 1,
            maxSize: 5
        };

        $scope.searchParams = {
            searchEmail: '',
            searchType: 'Type',
            searchTxHash:'',
            searchRehiveCode:'',
            searchDateFrom: '',
            searchDateTo: '',
            searchStatus: 'Status',
            searchOrderBy: 'Latest'
        };

        $scope.transactions = [];
        $scope.transactionsStateMessage = '';
        $scope.transactionsData = {};
        $scope.loadingTransactions = false;
        $scope.typeOptions = ['Type','Deposit','Send','Withdraw'];
        $scope.statusOptions = ['Status','Pending','Confirmed','Complete','Failed'];
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

        $scope.clearFilters = function () {
            $scope.searchParams = {
                searchEmail: '',
                searchType: 'Type',
                searchTxHash:'',
                searchRehiveCode:'',
                searchDateFrom: '',
                searchDateTo: '',
                searchStatus: 'Status',
                searchOrderBy: 'Latest'
            };
        };

        vm.getTransactionUrl = function(){
            vm.filterParams = '?page=' + $scope.pagination.pageNo + '&page_size=' + $scope.pagination.itemsPerPage
                + '&email=' + ($scope.searchParams.searchEmail? encodeURIComponent($scope.searchParams.searchEmail) : '')
                + '&tx_type=' + ($scope.searchParams.searchType == 'Type' ? '' : $scope.searchParams.searchType.toLowerCase())
                + '&transaction_hash=' + $scope.searchParams.searchTxHash
                + '&rehive_code=' + $scope.searchParams.searchRehiveCode
                + '&created__gt=' + ($scope.searchParams.searchDateFrom? Date.parse($scope.searchParams.searchDateFrom + 'T00:00:00') : '')
                + '&created__lt=' + ($scope.searchParams.searchDateTo? Date.parse($scope.searchParams.searchDateTo + 'T00:00:00') : '')
                + '&status=' + ($scope.searchParams.searchStatus == 'Status' ? '' : $scope.searchParams.searchStatus)
                + '&orderby=' + ($scope.searchParams.searchOrderBy == 'Latest' ? '-created' : $scope.searchParams.searchOrderBy == 'Largest' ? '-amount' : $scope.searchParams.searchOrderBy == 'Smallest' ? 'amount' : '');

            return cookieManagement.getCookie('SERVICEURL')+ 'admin/transactions/' + vm.filterParams;
        };

        $scope.getLatestTransactions = function(applyFilter){
            if(vm.token){
                $scope.transactionsStateMessage = '';
                $scope.loadingTransactions = true;

                if(applyFilter){
                  // if function is called from history-filters directive, then pageNo set to 1
                    $scope.pagination.pageNo = 1;
                }

                if($scope.transactions.length > 0 ){
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
                        if($scope.transactions == 0){
                            $scope.transactionsStateMessage = 'No transactions have been made';
                            return;
                        }

                        $scope.transactionsStateMessage = '';
                    }
                }).catch(function (error) {
                    $scope.loadingTransactions = false;
                    if(error.status == 403){
                        $location.path('/services');
                        return
                    }
                    $scope.transactionsStateMessage = 'Failed to load data';
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        $scope.getLatestTransactions();

        $scope.openModal = function (page, size,transaction) {
            $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'EthereumServiceTransactionsModalCtrl',
                resolve: {
                    transaction: function () {
                        return transaction;
                    }
                }
            });
        };

    }

})();
