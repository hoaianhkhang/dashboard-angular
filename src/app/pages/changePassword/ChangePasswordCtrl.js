(function () {
    'use strict';

    angular.module('BlurAdmin.pages.changePassword')
        .controller('ChangePasswordCtrl', ChangePasswordCtrl);

    /** @ngInject */
    function ChangePasswordCtrl($rootScope,$scope,Rehive,localStorageManagement,errorHandler,$location,toastr) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        $scope.passwordChanged = false;

        $scope.goToDashboard = function(){
            $rootScope.securityConfigured = true;
            $location.path('/settings/security');
        };

        $scope.changePassword = function (passwordChangeParams) {
            $scope.changingPassword = true;
            Rehive.auth.password.change(passwordChangeParams).then(function(res){
                $scope.changingPassword = false;
                $scope.passwordChanged = true;
                toastr.success('New password has been saved');
                $scope.$apply();
            },function(error){
                $scope.changingPassword = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };


    }
})();
