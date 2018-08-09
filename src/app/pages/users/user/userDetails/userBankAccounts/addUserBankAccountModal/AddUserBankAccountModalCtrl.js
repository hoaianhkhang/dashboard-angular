(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('AddUserBankAccountModalCtrl', AddUserBankAccountModalCtrl);

    function AddUserBankAccountModalCtrl($scope,Rehive,$uibModalInstance,toastr,$stateParams,localStorageManagement,errorHandler) {

        var vm = this;

        $scope.userBankAccountParams = {status: 'Pending'};
        vm.uuid = $stateParams.uuid;
        $scope.bankStatusOptions = ['Pending', 'Incomplete', 'Declined', 'Obsolete', 'Verified'];
        vm.token = localStorageManagement.getValue('token');

        $scope.addUserBankAccount = function(userBankAccountParams){
            if(vm.token) {
                userBankAccountParams.user = vm.uuid;
                $scope.loadingUserBankAccount = true;
                userBankAccountParams.status = userBankAccountParams.status.toLowerCase();
                Rehive.admin.users.bankAccounts.create(userBankAccountParams).then(function (res) {
                    $scope.loadingUserBankAccount = false;
                    $scope.userBankAccountParams = {status: 'Pending'};
                    toastr.success('Successfully added user bank accountss');
                    $uibModalInstance.close(res);
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingUserBankAccount = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };



    }
})();
