(function () {
    'use strict';

    angular.module('BlurAdmin.pages.settings.bankAccounts')
        .controller('BankAccountModalCtrl', BankAccountModalCtrl);

    function BankAccountModalCtrl($scope,Rehive,$uibModalInstance,bankAccount,toastr,localStorageManagement,errorHandler) {

        var vm = this;

        $scope.bankAccount = bankAccount;
        vm.token = localStorageManagement.getValue('TOKEN');
        $scope.deletingBankAccount = false;


        $scope.deleteBankAccount = function () {
            $scope.deletingBankAccount = true;
            Rehive.admin.bankAccounts.delete($scope.bankAccount.id).then(function (res) {
                $scope.deletingBankAccount = false;
                toastr.success('Bank account successfully deleted');
                $uibModalInstance.close(res);
                $scope.$apply();
            }, function (error) {
                $scope.deletingBankAccount = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };



    }
})();
