(function () {
    'use strict';

    angular.module('BlurAdmin.pages.verifyAdminEmail')
        .controller('VerifyAdminEmailCtrl', VerifyAdminEmailCtrl);

    /** @ngInject */
    function VerifyAdminEmailCtrl($scope,$stateParams,$http,toastr,$location,environmentConfig,errorHandler) {

        $scope.verifyAdminEmail = function(){
            $http.post(environmentConfig.API + '/auth/email/verify/', {
                key: $stateParams.key
            }).then(function (res) {
                if (res.status === 200) {
                    toastr.success("Email has been verified successfully");
                    $location.path('/verification');
                }
            }).catch(function (error) {
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
                $location.path('/currencies');
            });
        };
        $scope.verifyAdminEmail();

    }
})();
