(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.ethereumService.ethereumServiceAccounts')
        .controller('WarmstorageTransactionModalCtrl', WarmstorageTransactionModalCtrl);

    function WarmstorageTransactionModalCtrl($uibModalInstance,$scope,uuid,$state,
                              transaction,metadataTextService,$location,localStorageManagement) {


        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        $scope.transaction = transaction;
        vm.uuid = uuid;
        $scope.updateTransactionObj = {};
        $scope.formatted = {};
        $scope.formatted.metadata = metadataTextService.convertToText($scope.transaction.metadata);
        $scope.editingTransaction = false;
        $scope.updatingTransaction = false;

        $scope.goToWarmstorageUser = function () {
            $uibModalInstance.close();
            $location.path('/user/' + vm.uuid + '/details');
        };

        $scope.goToWarmstorageTransaction = function () {
            $uibModalInstance.close();
            $state.go('transactions.history',{"transactionId": transaction.id});
        };

    }
})();
