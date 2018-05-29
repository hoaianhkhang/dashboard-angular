(function () {
    'use strict';

    angular.module('BlurAdmin.pages.settings.adminEmails')
        .controller('AdminEmailsCtrl', AdminEmailsCtrl);

    /** @ngInject */
    function AdminEmailsCtrl($scope,Rehive,$location,localStorageManagement,errorHandler,toastr) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        $scope.addingEmail = false;
        $scope.loadingAdminEmails = true;
        $scope.newEmail = {primary: true};

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

        $scope.createEmail = function (newEmail) {
            $scope.loadingAdminEmails = true;
            if(vm.token) {
                Rehive.user.emails.create(newEmail).then(function (res)
                {
                    $scope.loadingAdminEmails = false;
                    toastr.success('Email added successfully');
                    $scope.toggleAddEmailView();
                    $scope.newEmail = {primary: true};
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

        $scope.goToAccountInfo = function(){
            $location.path('/settings/account-info');
        };

    }
})();
