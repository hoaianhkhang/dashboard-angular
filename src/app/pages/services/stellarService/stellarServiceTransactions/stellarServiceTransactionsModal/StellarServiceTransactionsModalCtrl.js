(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarService.stellarServiceTransactions')
        .controller('StellarServiceTransactionsModalCtrl', StellarServiceTransactionsModalCtrl);

    function StellarServiceTransactionsModalCtrl($uibModalInstance,$scope,transaction,metadataTextService,$state,$location) {

        $scope.formattedData = {};
        $scope.formattedData.rehive_response = metadataTextService.convertToText(transaction.rehive_response);
        $scope.formattedData.horizon_response = metadataTextService.convertToText(transaction.horizon_response);
        $scope.transaction = transaction;

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
