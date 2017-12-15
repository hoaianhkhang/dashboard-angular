(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('UserCryptoAccountsModalCtrl', UserCryptoAccountsModalCtrl);

    function UserCryptoAccountsModalCtrl($scope,$uibModalInstance,userCryptoAccount,uuid,metadataTextService,
                                         toastr,$http,environmentConfig,cookieManagement,errorHandler) {

        var vm = this;

        $scope.userCryptoAccount = userCryptoAccount;
        vm.uuid = uuid;
        $scope.deletingUserCryptoAccount = false;
        vm.token = cookieManagement.getCookie('TOKEN');

        $scope.deleteUserCryptoAccount = function () {
            $scope.deletingUserCryptoAccount = true;
            $http.delete(environmentConfig.API + '/admin/users/crypto-accounts/' + userCryptoAccount.id + '/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.deletingUserCryptoAccount = false;
                if (res.status === 200) {
                    toastr.success('Crypto account successfully deleted');
                    $uibModalInstance.close($scope.userCryptoAccount);
                }
            }).catch(function (error) {
                $scope.deletingUserCryptoAccount = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };



    }
})();
