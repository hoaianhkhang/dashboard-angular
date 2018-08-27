(function () {
    'use strict';

    angular.module('BlurAdmin.pages.multiFactorAuthVerify')
        .controller('MultiFactorAuthVerifyCtrl', MultiFactorAuthVerifyCtrl);

    /** @ngInject */
    function MultiFactorAuthVerifyCtrl($scope,Rehive,localStorageManagement,errorHandler,toastr,$stateParams,$location) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        $scope.authType = $stateParams.authType;
        $scope.verifyTokenObj = {token: ''};
        $scope.tokenAuthenticationEnabled = false;
        $scope.prevLocation = $location.search().prevUrl;

        vm.getTokenAuthenticationDetails = function(){
            if(vm.token) {
                $scope.loadingVerifyAuth = true;
                Rehive.auth.mfa.token.get().then(function (res) {
                    $scope.tokenAuthenticationDetails = res;
                    $scope.qrCodeUrl = 'https://chart.googleapis.com/chart?cht=qr&chl='+
                        encodeURIComponent(res.otpauth_url) + '&chs=200x200&chld=L|0';
                    delete $scope.tokenAuthenticationDetails['otpauth_url'];
                    $scope.loadingVerifyAuth = false;
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingVerifyAuth = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        vm.checkIfTokenAuthenticationEnabled = function(){
            if(vm.token) {
                $scope.loadingVerifyAuth = true;
                Rehive.auth.mfa.token.get().then(function (res) {
                    if(res && res.confirmed){
                        $scope.tokenAuthenticationEnabled = true;
                        $scope.$apply();
                    }
                }, function (error) {
                    $scope.loadingVerifyAuth = false;
                    $scope.$apply();
                });
            }
        };

        if(($scope.prevLocation != 'login') && $scope.authType == 'token'){
            vm.getTokenAuthenticationDetails();
            vm.checkIfTokenAuthenticationEnabled();
        }

        $scope.deleteTokenAuth = function(){
            if(vm.token) {
                $scope.loadingVerifyAuth = true;
                Rehive.auth.mfa.token.disable().then(function (res) {
                    toastr.success('Token authentication successfully disabled');
                    $location.path('/authentication/multi-factor');
                    $scope.loadingVerifyAuth = false;
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingVerifyAuth = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        $scope.resendSmsAuthNumber = function(){
            if(vm.token) {
                $scope.loadingVerifyAuth = true;
                Rehive.auth.mfa.sms.send().then(function (res) {
                    toastr.success('Otp has been resent to your mobile number successfully');
                    $scope.loadingVerifyAuth = false;
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingVerifyAuth = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        $scope.verifyToken = function(){
            if(vm.token) {
                $scope.loadingVerifyAuth = true;
                Rehive.auth.mfa.verify($scope.verifyTokenObj).then(function (res)
                {
                    $location.search('prevUrl', null);
                    toastr.success('Token successfully verified');
                    if($scope.prevLocation == 'login'){
                        $location.path('/currencies');
                        $scope.$apply();
                    } else {
                        $scope.loadingVerifyAuth = false;
                        $location.path('/settings/security');
                        $scope.$apply();
                    }
                }, function (error) {
                    $scope.loadingVerifyAuth = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

    }
})();
