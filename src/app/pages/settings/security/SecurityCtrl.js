(function () {
    'use strict';

    angular.module('BlurAdmin.pages.settings.security')
        .controller('SecurityCtrl', SecurityCtrl);

    /** @ngInject */
    function SecurityCtrl($scope,Rehive,$location,localStorageManagement,errorHandler) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        $scope.activatedMfa = 'None';

        vm.checkMultiFactorAuthEnabled = function () {
            if(vm.token) {
                Rehive.auth.mfa.status.get().then(function (res) {
                    for(var key in res){
                        if (res.hasOwnProperty(key)) {
                            if(res[key]){
                                if(key === 'sms'){
                                    $scope.activatedMfa = key.toUpperCase();
                                } else {
                                    $scope.activatedMfa = key;
                                }
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

    }
})();
