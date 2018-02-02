(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.bitcoinService.bitcoinServiceAccounts')
        .controller('HotwalletTransactionsModalCtrl', HotwalletTransactionsModalCtrl);

    function HotwalletTransactionsModalCtrl($uibModalInstance,$scope,uuid,cookieManagement,$state,
                                             transaction,metadataTextService,$location) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
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
