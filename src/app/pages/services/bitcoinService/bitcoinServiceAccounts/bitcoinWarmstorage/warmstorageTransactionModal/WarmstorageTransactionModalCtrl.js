(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.bitcoinService.bitcoinServiceAccounts')
        .controller('WarmstorageTransactionModalCtrl', WarmstorageTransactionModalCtrl);

    function WarmstorageTransactionModalCtrl($uibModalInstance,$scope,uuid,$state,
                              transaction,metadataTextService,$location,cookieManagement) {


        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
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
