(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('EditUserBankAccountModalCtrl', EditUserBankAccountModalCtrl);

    function EditUserBankAccountModalCtrl($scope,$uibModalInstance,bankAccount,toastr,$stateParams,$filter,
                                      $http,environmentConfig,cookieManagement,errorHandler) {

        var vm = this;
        vm.uuid = $stateParams.uuid;
        $scope.userbankAccount = bankAccount;
        vm.updatedUserBankAccount = {};
        $scope.editUserBankAccount = {};
        $scope.editingUserBankAccount = true;
        $scope.statusOptions = ['Pending', 'Incomplete', 'Declined', 'Verified'];
        vm.token = cookieManagement.getCookie('TOKEN');

        vm.getUserBankAccount = function () {
            $scope.editingUserBankAccount = true;
            $http.get(environmentConfig.API + '/admin/users/bank-accounts/' + $scope.userbankAccount.id + '/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.editingUserBankAccount = false;
                if (res.status === 200) {
                    $scope.editUserBankAccount = res.data.data;
                    $scope.editUserBankAccount.status = $filter('capitalizeWord')(res.data.data.status);
                }
            }).catch(function (error) {
                $scope.editingUserBankAccount = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
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
                $http.patch(environmentConfig.API + '/admin/users/bank-accounts/' + $scope.editUserBankAccount.id + '/',vm.updatedUserBankAccount,{
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.editingUserBankAccount = false;
                    if (res.status === 200) {
                        vm.updatedUserBankAccount = {};
                        $scope.editUserBankAccount = {};
                        toastr.success('Successfully updated user bank account');
                        $uibModalInstance.close(res.data);
                    }
                }).catch(function (error) {
                    $scope.editingUserBankAccount = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };



    }
})();
