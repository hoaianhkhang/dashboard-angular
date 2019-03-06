(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarService.stellarServiceTransactions')
        .controller('StellarServiceTransactionsModalCtrl', StellarServiceTransactionsModalCtrl);

    function StellarServiceTransactionsModalCtrl($uibModalInstance,$scope,$http,transaction,localStorageManagement,
                                                 errorHandler,metadataTextService,$state,$location) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        // vm.serviceUrl = localStorageManagement.getValue('SERVICEURL');
        vm.serviceUrl = "https://stellar.services.rehive.io/api/1/";
        $scope.formattedData = {};

        vm.getTransaction = function(){
            if(vm.token) {
                $scope.loadingTransaction = true;
                $http.get(vm.serviceUrl + 'admin/transactions/?transaction_hash=' + transaction.transaction_hash, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $scope.transaction = res.data.data.results[0];
                        $scope.formattedData.rehive_response = metadataTextService.convertToText($scope.transaction.rehive_response);
                        $scope.formattedData.horizon_response = metadataTextService.convertToText($scope.transaction.horizon_response);
                        $scope.loadingTransaction = false;
                    }
                }).catch(function (error) {
                    $scope.loadingTransaction = false;
                    $scope.transactionsStateMessage = 'Failed to load data';
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        vm.getTransaction();

        $scope.goToUser = function () {
            $uibModalInstance.close();
            $location.path('/user/' + $scope.transaction.user.id + '/details');
        };

        $scope.goToTransactions = function(rehiveCode){
            $uibModalInstance.close();
            $state.go('transactions.history',{"transactionId": rehiveCode});
        };
    }
})();
