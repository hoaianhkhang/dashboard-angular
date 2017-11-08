(function () {
    'use strict';

    angular.module('BlurAdmin.pages.resetPasswordConfirmation')
        .controller('ResetPasswordConfirmationCtrl', ResetPasswordConfirmationCtrl);

    /** @ngInject */
    function ResetPasswordConfirmationCtrl($scope,$stateParams,$http,toastr,$location,environmentConfig,errorHandler) {

        $scope.passwordResetDone = false;
        $scope.resettingPassword = false;
        $scope.passwordResetParams = {};
        $scope.showPassword1 = false;
        $scope.showPassword2 = false;

        $scope.togglePasswordVisibility1 = function () {
            $scope.showPassword1 = !$scope.showPassword1;
        };

        $scope.togglePasswordVisibility2 = function () {
            $scope.showPassword2 = !$scope.showPassword2;
        };

        $scope.resetPassword = function(passwordResetParams){
            $scope.resettingPassword = true;
            $http.post(environmentConfig.API + '/auth/password/reset/confirm/', {
                new_password1: passwordResetParams.new_password1,
                new_password2: passwordResetParams.new_password2,
                uid: $stateParams.uid,
                token: $stateParams.token
            }).then(function (res) {
                if (res.status === 200) {
                    $scope.resettingPassword = false;
                    $scope.passwordResetDone = true;
                    toastr.success('Password has been reset with the new password');
                    $location.path('/login');
                }
            }).catch(function (error) {
                $scope.resettingPassword = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        $scope.goToLogin = function(){
            $location.path('/login');
        }

    }
})();
