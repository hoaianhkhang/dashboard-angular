(function () {
    'use strict';

    angular.module('BlurAdmin.pages.transactions.debit.pendingDebit')
        .controller('PendingDebitCtrl', PendingDebitCtrl);

    /** @ngInject */
    function PendingDebitCtrl($scope,$http,environmentConfig,cookieManagement,$uibModal,errorHandler) {

        var vm = this;
        $scope.transactions = {};
        $scope.transactions.list = [];
        $scope.transactionsStateMessage = '';
        $scope.pendingTransactionData = {currency: {}};
        $scope.loadingPendingTransactions = false;
        vm.token = cookieManagement.getCookie('TOKEN');

        $scope.pagination = {
            itemsPerPage: 12,
            pageNo: 1,
            maxSize: 5
        };

        vm.getCompanyCurrencies = function(){
            if(vm.token){
                $http.get(environmentConfig.API + '/admin/currencies/?enabled=true&page_size=250', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $scope.currencyOptions = res.data.data.results;
                    }
                }).catch(function (error) {
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        vm.getCompanyCurrencies();

        vm.getTransactionUrl = function(){

            vm.filterParams = '?page=' + $scope.pagination.pageNo + '&page_size=' + $scope.pagination.itemsPerPage
                + '&currency=' + $scope.pendingTransactionData.currency.code
                + '&orderby=-created'
                + '&tx_type=debit'
                + '&status=Pending'; // all the params of the filtering

            return environmentConfig.API + '/admin/transactions/' + vm.filterParams;
        };

        $scope.getPendingTransactions = function(){
            $scope.loadingPendingTransactions = true;
            $scope.transactionsStateMessage = '';

            if($scope.transactions.list.length > 0){
                $scope.transactions.list.length = 0;
            }

            var transactionsUrl = vm.getTransactionUrl();

            $http.get(transactionsUrl, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                if (res.status === 200) {
                    $scope.loadingPendingTransactions = false;
                    if(res.data.data.results.length == 0){
                        $scope.transactionsStateMessage = 'No pending transactions';
                        return;
                    }
                    $scope.transactions.data = res.data.data;
                    $scope.transactions.list = res.data.data.results;
                    $scope.transactionsStateMessage = '';
                }
            }).catch(function (error) {
                $scope.loadingPendingTransactions = false;
                $scope.transactionsStateMessage = 'Failed to load data';
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        $scope.openModal = function (page, size,transaction) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'PendingDebitModalCtrl',
                resolve: {
                    transaction: function () {
                        return transaction;
                    }
                }
            });

        };

        $scope.$on("modalClosing",function(event,transactionHasBeenUpdated){
            if(transactionHasBeenUpdated){
                $scope.getPendingTransactions();
            }
        });

    }
})();
