(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('EditUserEmailModalCtrl', EditUserEmailModalCtrl);

    function EditUserEmailModalCtrl($rootScope,$scope,$stateParams,$uibModalInstance,user,email,toastr,$http,environmentConfig,localStorageManagement,errorHandler) {

        var vm = this;
        $scope.user = user;
        $scope.email = email;
        vm.uuid = $stateParams.uuid;
        $scope.editUserEmailObj = {};
        vm.updatedUserEmail = {};
        vm.token = localStorageManagement.getValue('TOKEN');
        $scope.loadingUserEmails = false;


        vm.getUserEmail =  function () {
            if(vm.token) {
                $scope.loadingUserEmails = true;
                $http.get(environmentConfig.API + '/admin/users/emails/' + $scope.email.id + '/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingUserEmails = false;
                    if (res.status === 200) {
                        $scope.editUserEmailObj = res.data.data;
                    }
                }).catch(function (error) {
                    $scope.loadingUserEmails = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        vm.getUserEmail();

        $scope.editUserEmail =  function (editUserEmailObj) {
            if(vm.token) {
                $scope.loadingUserEmails = true;
                $http.patch(environmentConfig.API + '/admin/users/emails/' + $scope.email.id + '/',editUserEmailObj, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingUserEmails = false;
                    if (res.status === 200) {
                        toastr.success('Email successfully updated');
                        $uibModalInstance.close(res.data);
                    }
                }).catch(function (error) {
                    $scope.loadingUserEmails = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

    }
})();
