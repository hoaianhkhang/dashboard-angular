(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('UserAdminCtrl', UserAdminCtrl);

    /** @ngInject */
    function UserAdminCtrl($scope,Rehive,toastr,$stateParams,localStorageManagement,$ngConfirm,$uibModal,errorHandler) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        vm.uuid = $stateParams.uuid;
        vm.companyIdentifier = localStorageManagement.getValue('companyIdentifier');
        $scope.loadingUserAdmin = false;
        $scope.listOfEmails = [];
        vm.emailSituation = '';
        $scope.mfaStatus = 'not';

        vm.getUser = function(){
            if(vm.token) {
                $scope.loadingUserAdmin = true;
                Rehive.admin.users.get({id: vm.uuid}).then(function (res) {
                    $scope.loadingUserAdmin = false;
                    $scope.user = res;
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingUserAdmin = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.getUser();

        $scope.checkUserMFAStatus = function () {
            if(vm.token) {
                Rehive.admin.users.mfa.get(vm.uuid).then(function (res) {
                    for(var key in res){
                        if (res.hasOwnProperty(key)) {
                            if(res[key]){
                                $scope.mfaStatus = key;
                                $scope.$apply();
                            }
                        }
                    }
                }, function (error) {
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        $scope.checkUserMFAStatus();

        $scope.removeMFAStatusConfirm = function () {
            $ngConfirm({
                title: 'Remove multi-factor authentication',
                content: "You are removing multi-factor authentication from this user's account, are you sure you want to proceed?",
                animationBounce: 1,
                animationSpeed: 100,
                scope: $scope,
                buttons: {
                    close: {
                        text: "No",
                        btnClass: 'btn-default pull-left dashboard-btn'
                    },
                    ok: {
                        text: "Remove",
                        btnClass: 'btn-danger dashboard-btn',
                        keys: ['enter'], // will trigger when enter is pressed
                        action: function(scope){
                            vm.removeMFAStatus();
                        }
                    }
                }
            });
        };

        vm.removeMFAStatus = function () {
            if(vm.token) {
                $scope.loadingUserAdmin = true;
                if($scope.mfaStatus == "sms"){
                    Rehive.admin.users.mfa.sms.delete(vm.uuid).then(function (res) {
                        toastr.success('SMS multi-factor authentication removed successfully');
                        $scope.loadingUserAdmin = false;
                        $scope.$apply();
                    }, function (error) {
                        $scope.loadingUserAdmin = false;
                        errorHandler.evaluateErrors(error);
                        errorHandler.handleErrors(error);
                        $scope.$apply();
                    });
                } else {
                    Rehive.admin.users.mfa.token.delete(vm.uuid).then(function (res) {
                        toastr.success('Token multi-factor authentication removed successfully');
                        $scope.loadingUserAdmin = false;
                        $scope.$apply();
                    }, function (error) {
                        $scope.loadingUserAdmin = false;
                        errorHandler.evaluateErrors(error);
                        errorHandler.handleErrors(error);
                        $scope.$apply();
                    });
                }
                $scope.mfaStatus = "not";
            }
        };

        $scope.getUserEmailsFromResendPasswordLink = function(){
            $scope.loadingUserAdmin = true;
            if(vm.token) {
                Rehive.admin.users.emails.get({filters: {user: vm.uuid}}).then(function (res) {
                    $scope.loadingUserAdmin = false;
                    if(res.results.length > 0){
                        $scope.listOfEmails = res.results;
                    } else {
                        $scope.listOfEmails = [];
                    }
                    vm.checkEmailSituation();
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingUserAdmin = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
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
            Rehive.auth.password.reset({
                user: vm.uuid,
                company: vm.companyIdentifier
            }).then(function(res){
                toastr.success('Password reset email sent successfully');
                $scope.$apply();
            }, function (error) {
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
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
