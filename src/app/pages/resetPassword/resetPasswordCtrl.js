(function () {
    'use strict';

    angular.module('BlurAdmin.pages.resetPassword')
        .controller('ResetPasswordCtrl', ResetPasswordCtrl);

    /** @ngInject */
    function ResetPasswordCtrl($scope,$http,toastr,$location,environmentConfig,errorHandler) {

        $scope.resetPasswordFunction = function(user,company){
            $http.post(environmentConfig.API + '/auth/password/reset/', {
                user: user,
                company: company
            }).then(function (res) {
                if (res.status === 200) {
                    toastr.success('Password reset message has been sent');
                    $location.path('/login');
                }
            }).catch(function (error) {
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

    }
})();
