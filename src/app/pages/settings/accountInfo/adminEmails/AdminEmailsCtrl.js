(function () {
    'use strict';

    angular.module('BlurAdmin.pages.settings.adminEmails')
        .controller('AdminEmailsCtrl', AdminEmailsCtrl);

    /** @ngInject */
    function AdminEmailsCtrl($scope,environmentConfig,$location,$http,localStorageManagement,errorHandler,toastr) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        $scope.addingEmail = false;
        $scope.loadingAdminEmails = true;
        $scope.newEmail = {primary: true};

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

        $scope.goToAccountInfo = function(){
            $location.path('/settings/account-info');
        };

    }
})();
