(function () {
    'use strict';

    angular.module('BlurAdmin.pages.smsAuth')
        .controller('SmsAuthenticationCtrl', SmsAuthenticationCtrl);

    /** @ngInject */
    function SmsAuthenticationCtrl($scope,Rehive,$http,environmentConfig,localStorageManagement,errorHandler,toastr,$location) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        $scope.smsAuthObj = {mobile_number: ''};
        $scope.numberFromGetCall = false;

        $scope.getSmsAuthNumber = function(){
            if(vm.token) {
                $scope.loadingSmsAuth = true;
                Rehive.auth.mfa.sms.get().then(function (res) {
                    if(res && res.mobile_number){
                        $scope.smsAuthObj.mobile_number = res.mobile_number;
                        $scope.numberFromGetCall = true;
                    }
                    $scope.loadingSmsAuth = false;
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingSmsAuth = false;
                    if(error.status == 404){
                        return;
                    }
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        $scope.getSmsAuthNumber();

        $scope.deleteSmsAuthNumber = function(){
            if(vm.token) {
                $scope.loadingSmsAuth = true;
                $http.delete(environmentConfig.API + '/auth/mfa/sms/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        toastr.success('Sms authentication disabled successfully');
                        $scope.smsAuthObj = {mobile_number: ''};
                        $scope.numberFromGetCall = false;
                        $scope.loadingSmsAuth = false;
                    }
                }).catch(function (error) {
                    $scope.loadingSmsAuth = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.postSmsAuthNumber = function(){
            if(vm.token) {
                $scope.loadingSmsAuth = true;
                Rehive.auth.mfa.sms.enable({
                    mobile_number: $scope.smsAuthObj.mobile_number
                }).then(function (res) {
                    toastr.success('Mobile number successfully saved, please enter the OTP to enable sms multi factor authentication');
                    $location.path('/authentication/multi-factor/verify/sms');
                    $scope.loadingSmsAuth = false;
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingSmsAuth = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };


    }
})();
