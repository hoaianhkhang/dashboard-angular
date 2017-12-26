(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('UserBankAccountModalCtrl', UserBankAccountModalCtrl);

    function UserBankAccountModalCtrl($scope,$uibModalInstance,bankAccount,toastr,$http,environmentConfig,cookieManagement,errorHandler) {

        var vm = this;

        $scope.userBankAccount = bankAccount;
        $scope.deletingUserBankAccount = false;
        vm.token = cookieManagement.getCookie('TOKEN');

        $scope.deleteUserBankAccount = function () {
            $scope.deletingUserBankAccount = true;
            $http.delete(environmentConfig.API + '/admin/users/bank-accounts/' + $scope.userBankAccount.id + '/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.deletingUserBankAccount = false;
                if (res.status === 200) {
                    toastr.success('Bank account successfully deleted');
                    $uibModalInstance.close($scope.userBankAccount);
                }
            }).catch(function (error) {
                $scope.deletingUserBankAccount = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };



    }
})();
