(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.bitcoinService.bitcoinServiceTransactions')
        .controller('BitcoinServiceTransactionsModalCtrl', BitcoinServiceTransactionsModalCtrl);

    function BitcoinServiceTransactionsModalCtrl($uibModalInstance,$scope,transaction,metadataTextService,$state,$location) {
        $scope.rehive_response = metadataTextService.convertToText(transaction.rehive_response);
        $scope.transaction = transaction;

        $scope.goToUser = function () {
            $uibModalInstance.close();
            $location.path('/user/' + $scope.transaction.user.identifier + '/details');
        };

        $scope.goToTransactions = function(rehiveCode){
            $uibModalInstance.close();
            $state.go('transactions.history',{"transactionId": rehiveCode});
        }
    }
})();
