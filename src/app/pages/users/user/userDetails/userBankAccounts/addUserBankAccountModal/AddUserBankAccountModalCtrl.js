(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('AddUserBankAccountModalCtrl', AddUserBankAccountModalCtrl);

    function AddUserBankAccountModalCtrl($scope,$uibModalInstance,toastr,$stateParams,$http,environmentConfig,cookieManagement,errorHandler) {

        var vm = this;

        $scope.userBankAccountParams = {status: 'Pending'};
        vm.uuid = $stateParams.uuid;
        $scope.bankStatusOptions = ['Pending', 'Incomplete', 'Declined', 'Obsolete', 'Verified'];
        vm.token = cookieManagement.getCookie('TOKEN');

        $scope.addUserBankAccount = function(userBankAccountParams){
            if(vm.token) {
                userBankAccountParams.user = vm.uuid;
                $scope.loadingUserBankAccount = true;
                userBankAccountParams.status = userBankAccountParams.status.toLowerCase();
                $http.post(environmentConfig.API + '/admin/users/bank-accounts/',userBankAccountParams,{
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingUserBankAccount = false;
                    if (res.status === 201) {
                        $scope.userBankAccountParams = {status: 'Pending'};
                        toastr.success('Successfully added user bank accountss');
                        $uibModalInstance.close(res.data);
                    }
                }).catch(function (error) {
                    $scope.loadingUserBankAccount = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };



    }
})();
