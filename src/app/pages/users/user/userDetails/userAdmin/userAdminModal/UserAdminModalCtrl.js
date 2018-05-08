(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('UserAdminModalCtrl', UserAdminModalCtrl);

    function UserAdminModalCtrl($scope,$uibModalInstance,toastr,$stateParams,$http,environmentConfig,
                                localStorageManagement,errorHandler) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.uuid = $stateParams.uuid;
        $scope.loadingUserEmailsList = true;
        $scope.selectedEmail = {};
        vm.companyIdentifier = localStorageManagement.getValue('companyIdentifier');

        vm.getUserEmails = function(){
            $scope.loadingUserEmailsList = true;
            if(vm.token) {
                $http.get(environmentConfig.API + '/admin/users/emails/?user=' + vm.uuid, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $scope.loadingUserEmailsList = false;
                        if(res.data.data.results.length > 0){
                            $scope.userEmailsList = res.data.data.results;
                        }
                    }
                }).catch(function (error) {
                    $scope.loadingUserEmailsList = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        vm.getUserEmails();

        $scope.resendEmailVerificationLink = function () {
            $scope.loadingUserEmailsList = true;
            $http.post(environmentConfig.API + '/auth/email/verify/resend/', {email: $scope.selectedEmail.email,company: vm.companyIdentifier}, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function (res) {
                $scope.loadingUserEmailsList = false;
                if (res.status === 200) {
                    toastr.success('Email verification resent successfully');
                    $uibModalInstance.close();
                }
            }).catch(function (error) {
                $scope.loadingUserEmailsList = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

    }
})();
