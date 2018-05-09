(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('UserAdminCtrl', UserAdminCtrl);

    /** @ngInject */
    function UserAdminCtrl($rootScope,$scope,environmentConfig,toastr,$stateParams,$http,localStorageManagement,$uibModal,errorHandler) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.uuid = $stateParams.uuid;
        vm.companyIdentifier = localStorageManagement.getValue('companyIdentifier');
        $scope.loadingUserAdmin = false;
        $scope.listOfEmails = [];
        vm.emailSituation = '';

        $scope.getUserEmailsFromResendPasswordLink = function(){
            $scope.loadingUserAdmin = true;
            if(vm.token) {
                $http.get(environmentConfig.API + '/admin/users/emails/?user=' + vm.uuid, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $scope.loadingUserAdmin = false;
                        if(res.data.data.results.length > 0){
                            $scope.listOfEmails = res.data.data.results;
                        } else {
                            $scope.listOfEmails = [];
                        }
                        vm.checkEmailSituation();
                    }
                }).catch(function (error) {
                    $scope.loadingUserAdmin = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.checkEmailSituation = function () {
            if($scope.listOfEmails.length == 0){
                vm.emailSituation = 'No emails';
                $scope.openAdminEmailStatusModal('app/pages/users/user/userDetails/userAdmin/adminEmailStatusModal/adminEmailStatusModal.html','md');
            } else{
                $scope.listOfEmails.forEach(function (email) {
                    if(email.primary){
                        vm.emailSituation = 'primary email exists';
                    }
                });

                if(vm.emailSituation == 'primary email exists'){
                    vm.resendPasswordResetLink();
                } else {
                    vm.emailSituation = 'No primary email';
                    $scope.openAdminEmailStatusModal('app/pages/users/user/userDetails/userAdmin/adminEmailStatusModal/adminEmailStatusModal.html','md',$scope.listOfEmails[0]);
                }

            }
        };

        vm.resendPasswordResetLink = function () {
            $http.post(environmentConfig.API + '/auth/password/reset/', {user: vm.uuid,company: vm.companyIdentifier}, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function (res) {
                if (res.status === 200) {
                    toastr.success('Password reset email sent successfully');
                }
            }).catch(function (error) {
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        $scope.openAdminEmailStatusModal = function (page, size,email) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'AdminEmailStatusModalCtrl',
                scope: $scope,
                resolve: {
                    emailSituation: function () {
                        return vm.emailSituation;
                    },
                    nonPrimaryEmail: function () {
                        return email || {};
                    }
                }
            });

            vm.theModal.result.then(function(user){
                if(user){
                    vm.getUserEmails();
                }
            }, function(){
            });
        };

        $scope.openResendVerifyEmailModal = function (page, size) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'UserAdminModalCtrl',
                scope: $scope
            });

            vm.theModal.result.then(function(user){
                if(user){
                    vm.getUserEmails();
                }
            }, function(){
            });
        };

    }
})();
