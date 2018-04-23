(function () {
    'use strict';

    angular.module('BlurAdmin.pages.changePassword')
        .controller('ChangePasswordCtrl', ChangePasswordCtrl);

    /** @ngInject */
    function ChangePasswordCtrl($rootScope,$scope,$http,environmentConfig,localStorageManagement,errorHandler,$location,toastr) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        $scope.passwordChanged = false;

        $scope.goToDashboard = function(){
            $rootScope.securityConfigured = true;
            $location.path('/settings/security');
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
                  $scope.passwordChanged = true;
                  toastr.success('New password has been saved');
                }
            }).catch(function (error) {
                $scope.changingPassword = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };


    }
})();
