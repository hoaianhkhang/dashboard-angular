(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('EditUserAccountModalCtrl', EditUserAccountModalCtrl);

    function EditUserAccountModalCtrl($scope,$uibModalInstance,account,toastr,$stateParams,$filter,
                                      $http,environmentConfig,cookieManagement,errorHandler) {

        var vm = this;
        vm.uuid = $stateParams.uuid;
        $scope.userAccount = account;
        vm.updatedUserAddress = {};
        $scope.editUserAddress = {};
        $scope.editingUserAddress = true;
        $scope.statusOptions = ['Pending', 'Incomplete', 'Declined', 'Verified'];
        vm.token = cookieManagement.getCookie('TOKEN');

        vm.getAccount = function(){
            if(vm.token) {
                $scope.loadingUserAccountsList = true;
                $http.get(environmentConfig.API + '/admin/accounts/' + $scope.userAccount.reference + '/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingUserAccountsList = false;
                    if (res.status === 200) {
                        $scope.editUserAccountParams = res.data.data;
                    }
                }).catch(function (error) {
                    $scope.loadingUserAccountsList = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        vm.getAccount();

        $scope.editUserAccountFunction = function (editUserAccountParams) {

            var updateUserAccount = {
                name: editUserAccountParams.name,
                primary: editUserAccountParams.primary
            };

            if(vm.token) {
                $scope.loadingUserAccountsList = true;
                $http.patch(environmentConfig.API + '/admin/accounts/' + editUserAccountParams.reference + '/',updateUserAccount , {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        toastr.success('Account updated successfully');
                        $scope.loadingUserAccountsList = false;
                        $uibModalInstance.close(res.data);
                    }
                }).catch(function (error) {
                    $scope.loadingUserAccountsList = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };



    }
})();
