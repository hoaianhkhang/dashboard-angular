(function () {
    'use strict';

    angular.module('BlurAdmin.pages.accountInfo')
        .controller('AccountInfoCtrl', AccountInfoCtrl);

    /** @ngInject */
    function AccountInfoCtrl($scope,environmentConfig,$http,localStorageManagement,errorHandler,toastr,$location) {
        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        $scope.loadingAccountInfo = true;
        $scope.showAdminEmails = false;
        $scope.changingPassword = false;
        $scope.addingEmail = false;
        $scope.loadingAdminEmails = true;
        $scope.newEmail = {primary: true};
        vm.updatedAdministrator = {};

        $scope.accountInfoChanged = function(field){
            vm.updatedAdministrator[field] = $scope.administrator[field];
        };

        vm.getAdminAccountInfo = function () {
            if(vm.token) {
                $http.get(environmentConfig.API + '/user/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingAccountInfo = false;
                    if (res.status === 200) {
                        $scope.administrator = res.data.data;
                    }
                }).catch(function (error) {
                    $scope.loadingAccountInfo = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        vm.getAdminAccountInfo();

        $scope.updateAdministratorAccount = function(){
            $scope.loadingAccountInfo = true;
            $http.patch(environmentConfig.API + '/user/', vm.updatedAdministrator ,{
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.loadingAccountInfo = false;
                if (res.status === 200) {
                    $scope.administrator = res.data.data;
                    toastr.success('You have successfully updated the administrator info');
                }
                vm.updatedAdministrator = {};
            }).catch(function (error) {
                vm.updatedAdministrator = {};
                $scope.loadingAccountInfo = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        vm.getUserEmails = function () {
            $scope.loadingAdminEmails = true;
            if(vm.token) {
                $http.get(environmentConfig.API + '/user/emails/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingAdminEmails = false;
                    if (res.status === 200) {
                        $scope.adminEmailsList = res.data.data;
                    }
                }).catch(function (error) {
                    $scope.loadingAdminEmails = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        vm.getUserEmails();

        $scope.updateEmail = function (email) {
            $scope.loadingAdminEmails = true;
            if(vm.token) {
                $http.patch(environmentConfig.API + '/user/emails/' + email.id + '/' , {primary: true}, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingAdminEmails = false;
                    if (res.status === 200) {
                        toastr.success('Primary email changed successfully');
                        vm.getUserEmails();
                    }
                }).catch(function (error) {
                    $scope.loadingAdminEmails = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.createEmail = function (newEmail) {
            $scope.loadingAdminEmails = true;
            if(vm.token) {
                $http.post(environmentConfig.API + '/user/emails/', newEmail , {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingAdminEmails = false;
                    if (res.status === 201) {
                        toastr.success('Email added successfully');
                        $scope.toggleAddEmailView();
                        $scope.newEmail = {primary: true};
                        vm.getUserEmails();
                    }
                }).catch(function (error) {
                    $scope.loadingAdminEmails = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.deleteEmail = function (email) {
            $scope.loadingAdminEmails = true;
            if(vm.token) {
                $http.delete(environmentConfig.API + '/user/emails/' + email.id + '/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingAdminEmails = false;
                    if (res.status === 200) {
                        toastr.success('Email deleted successfully');
                        vm.getUserEmails();
                    }
                }).catch(function (error) {
                    $scope.loadingAdminEmails = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.toggleAddEmailView = function(){
            $scope.addingEmail = !$scope.addingEmail;
        };

        $scope.changePassword = function (passwordChangeParams) {
            $scope.changingPassword = true;
            $http.post(environmentConfig.API + '/auth/password/change/', passwordChangeParams, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.changingPassword = false;
                if (res.status === 200) {
                    toastr.success('New password has been saved');
                    $scope.passwordChangeParams = {};
                }
            }).catch(function (error) {
                $scope.changingPassword = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        $scope.viewAllEmails = function (){
            $location.path('/admin/emails');
        };
    }
})();
