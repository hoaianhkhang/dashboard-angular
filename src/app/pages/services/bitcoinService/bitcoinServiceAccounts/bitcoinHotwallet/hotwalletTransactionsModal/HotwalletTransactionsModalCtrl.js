(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.bitcoinService.bitcoinServiceAccounts')
        .controller('HotwalletTransactionsModalCtrl', HotwalletTransactionsModalCtrl);

    function HotwalletTransactionsModalCtrl($uibModalInstance,$scope,cookieManagement,
                                             transaction,metadataTextService,$location) {

        $scope.transaction = transaction;
        $scope.updateTransactionObj = {};
        $scope.formatted = {};
        $scope.formatted.metadata = metadataTextService.convertToText($scope.transaction.metadata);
        $scope.editingTransaction = false;
        $scope.updatingTransaction = false;

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');

        $scope.goToUser = function () {
            $uibModalInstance.close();
            $location.path('/user/' + $scope.transaction.user.identifier + '/details');
        };
    }

})();
