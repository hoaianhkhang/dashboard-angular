(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarTestnetService.stellarTestnetServiceAccounts')
        .controller('StellarHotwalletTransactionsModalCtrl', StellarHotwalletTransactionsModalCtrl);

    function StellarHotwalletTransactionsModalCtrl($uibModalInstance,$scope,uuid,localStorageManagement,$state,
                                                   transaction,metadataTextService,$location) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        $scope.transaction = transaction;
        vm.uuid = uuid;
        $scope.updateTransactionObj = {};
        $scope.formatted = {};
        $scope.formatted.metadata = metadataTextService.convertToText($scope.transaction.metadata);
        $scope.editingTransaction = false;
        $scope.updatingTransaction = false;



        $scope.goToHotwalletUser = function () {
            $uibModalInstance.close();
            $location.path('/user/' + vm.uuid + '/details');
        };

        $scope.goToHotwalletTransaction = function () {
            $uibModalInstance.close();
            $state.go('transactions.history',{"transactionId": transaction.id});
        };
    }

})();
