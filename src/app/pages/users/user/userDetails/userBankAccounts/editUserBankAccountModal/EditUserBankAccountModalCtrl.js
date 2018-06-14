(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('EditUserBankAccountModalCtrl', EditUserBankAccountModalCtrl);

    function EditUserBankAccountModalCtrl($scope,$uibModalInstance,bankAccount,toastr,$stateParams,$filter,
                                          Rehive,localStorageManagement,errorHandler) {

        var vm = this;
        vm.uuid = $stateParams.uuid;
        $scope.userbankAccount = bankAccount;
        vm.updatedUserBankAccount = {};
        $scope.editUserBankAccount = {};
        $scope.editingUserBankAccount = true;
        $scope.bankStatusOptions = ['Pending', 'Incomplete', 'Declined', 'Obsolete', 'Verified'];
        vm.token = localStorageManagement.getValue('TOKEN');

        vm.getUserBankAccount = function () {
            $scope.editingUserBankAccount = true;
            Rehive.admin.users.bankAccounts.get({id: $scope.userbankAccount.id}).then(function (res) {
                $scope.editingUserBankAccount = false;
                $scope.editUserBankAccount = res;
                $scope.editUserBankAccount.status = $filter('capitalizeWord')(res.status);
                $scope.$apply();
            }, function (error) {
                $scope.editingUserBankAccount = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };
        vm.getUserBankAccount();

        $scope.userBankAccountChanged =  function (field) {
            vm.updatedUserBankAccount[field] = $scope.editUserBankAccount[field];
        };

        $scope.updateUserBankAccount = function(){
            if(vm.token) {
                $scope.editingUserBankAccount = true;
                vm.updatedUserBankAccount.status ? vm.updatedUserBankAccount.status = vm.updatedUserBankAccount.status.toLowerCase() : '';
                Rehive.admin.users.bankAccounts.update($scope.editUserBankAccount.id,vm.updatedUserBankAccount).then(function (res) {
                    $scope.editingUserBankAccount = false;
                    vm.updatedUserBankAccount = {};
                    $scope.editUserBankAccount = {};
                    toastr.success('Successfully updated user bank account');
                    $uibModalInstance.close(res);
                    $scope.$apply();
                }, function (error) {
                    $scope.editingUserBankAccount = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };



    }
})();
