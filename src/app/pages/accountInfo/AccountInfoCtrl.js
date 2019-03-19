(function () {
    'use strict';

    angular.module('BlurAdmin.pages.accountInfo')
        .controller('AccountInfoCtrl', AccountInfoCtrl);

    /** @ngInject */
    function AccountInfoCtrl($rootScope, $scope,Rehive,localStorageManagement,errorHandler,toastr,$location,
                             $uibModal, Upload, environmentConfig, serializeFiltersService) {
        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        $rootScope.dashboardTitle = 'My Profile | Rehive';
        $scope.loadingAccountInfo = true;
        $scope.changingPassword = false;
        $scope.addingEmail = false;
        $scope.loadingAdminEmails = true;
        $scope.newEmail = {primary: true};
        $scope.hasProfileImage = false;
        vm.updatedAdministrator = {};
        $scope.activatedMfa = 'None';
        $scope.imageFile = {
            file: {}
        };

        $scope.upload = function () {
            if(!$scope.imageFile.file.name){
                return;
            }
            $scope.loadingAccountInfo = true;

            var uploadDataObj = {
                logo: null,
                icon: null,
                image: $scope.imageFile.file.name ? $scope.imageFile.file.name : null
            };

            Upload.upload({
                url: environmentConfig.API +'/admin/company/',
                data: serializeFiltersService.objectFilters(uploadDataObj),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token},
                method: "PATCH"
            }).then(function (res) {
                console.log(res);
                if (res.status === 200) {
                    setTimeout(function(){
                        // $scope.companyImageUrl = res.data.data.logo;
                        $scope.loadingAccountInfo = false;
                    },10);
                    //$window.location.reload();
                }
                toastr.success('Image(s) uploaded successfully. Refresh the page to see changes.');
            }).catch(function (error) {
                $scope.loadingAccountInfo = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };


        vm.checkMultiFactorAuthEnabled = function () {
            if(vm.token) {
                Rehive.auth.mfa.status.get().then(function (res) {
                    for(var key in res){
                        if (res.hasOwnProperty(key)) {
                            if(res[key]){
                                $scope.activatedMfa = key;
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
        vm.checkMultiFactorAuthEnabled();

        $scope.enableMultiFactorAuth = function(){
            $location.path('/authentication/multi-factor');
        };

        $scope.goToDisableMFA = function () {
            if($scope.activatedMfa.toLowerCase() === 'sms'){
                $location.path('/authentication/multi-factor/sms');
            } else {
                $location.path('/authentication/multi-factor/verify/token');
            }
        };


        $scope.accountInfoChanged = function(field){
            vm.updatedAdministrator[field] = $scope.administrator[field];
        };

        vm.getAdminAccountInfo = function () {
            if(vm.token) {
                $scope.loadingAccountInfo = true;
                Rehive.user.get().then(function(res){
                    $scope.loadingAccountInfo = false;
                    $scope.administrator = res;
                    $scope.$apply();
                },function(error){
                    $scope.loadingAccountInfo = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.getAdminAccountInfo();

        $scope.updateAdministratorAccount = function(){
            $scope.loadingAccountInfo = true;
            Rehive.user.update(vm.updatedAdministrator).then(function (res) {
                $scope.loadingAccountInfo = false;
                $scope.administrator = res;
                vm.updatedAdministrator = {};
                toastr.success('You have successfully updated the administrator info');
                $scope.$apply();
            }, function (error) {
                vm.updatedAdministrator = {};
                $scope.loadingAccountInfo = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

        vm.getUserEmails = function () {
            $scope.loadingAdminEmails = true;
            if(vm.token) {
                Rehive.user.emails.get().then(function (res) {
                    $scope.loadingAdminEmails = false;
                    $scope.adminEmailsList = res;
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingAdminEmails = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.getUserEmails();

        $scope.updateEmail = function (email) {
            $scope.loadingAdminEmails = true;
            if(vm.token) {
                Rehive.user.emails.update(email.id,{primary: true}).then(function (res) {
                    $scope.loadingAdminEmails = false;
                    toastr.success('Primary email changed successfully');
                    vm.getUserEmails();
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingAdminEmails = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        $scope.openAddEmailModal = function (page, size) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'AddEmailModalCtrl',
                scope: $scope
            });

            vm.theModal.result.then(function(newEmail){
                if(newEmail){
                    vm.getUserEmails();
                }
            }, function(){
            });
        };

        $scope.deleteEmail = function (email) {
            $scope.loadingAdminEmails = true;
            if(vm.token) {
                Rehive.user.emails.delete(email.id).then(function (res) {
                    $scope.loadingAdminEmails = false;
                    toastr.success('Email deleted successfully');
                    vm.getUserEmails();
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingAdminEmails = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        $scope.toggleAddEmailView = function(){
            $scope.addingEmail = !$scope.addingEmail;
        };

        $scope.changePassword = function (passwordChangeParams) {
            $scope.changingPassword = true;
            Rehive.auth.password.change(passwordChangeParams).then(function(res){
                $scope.changingPassword = false;
                toastr.success('New password has been saved');
                $scope.passwordChangeParams = {};
                $scope.$apply();
            },function(error){
                $scope.changingPassword = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

        $scope.viewAllEmails = function (){
            $location.path('/admin/emails');
        };
    }
})();
