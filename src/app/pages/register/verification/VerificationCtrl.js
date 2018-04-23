(function () {
    'use strict';

    angular.module('BlurAdmin.pages.verification')
        .controller('VerificationCtrl', VerificationCtrl);

    /** @ngInject */
    function VerificationCtrl($rootScope,$scope,$http,toastr,environmentConfig,
                              localStorageManagement,$location,errorHandler,userVerification,_) {

        var vm = this;
        vm.user = {};
        vm.token = localStorageManagement.getValue('TOKEN');
        $scope.verifyingEmail = false;
        $rootScope.$pageFinishedLoading = false;

        vm.checkIfUserVerified = function(){
            userVerification.verify(function(err,verified){
                if(verified){
                    $rootScope.userFullyVerified = true;
                    $location.path('/welcome_to_rehive');
                } else {
                    $rootScope.$pageFinishedLoading = true;
                }
            });
        };
        vm.checkIfUserVerified();

        $scope.verifyUser = function(){
            $scope.verifyingEmail = true;
            userVerification.verify(function(err,verified){
                if(verified){
                    $scope.verifyingEmail = false;
                    $rootScope.userFullyVerified = true;
                    $location.path('/welcome_to_rehive');
                } else {
                    $scope.verifyingEmail = false;
                    toastr.error('Please verify your account');
                }
            });
        };

        vm.getUserInfo = function(){
            $http.get(environmentConfig.API + '/user/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                if (res.status === 200) {
                    vm.user = res.data.data;
                }
            }).catch(function (error) {
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };
        vm.getUserInfo();

        $scope.resendEmail = function(){
            $http.post(environmentConfig.API + '/auth/email/verify/resend/',{email: vm.user.email,company: vm.user.company}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                if (res.status === 200) {
                    toastr.success('Verification email has been re-sent');
                }
            }).catch(function (error) {
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        $scope.logout = function () {
            $rootScope.dashboardTitle = 'Rehive';
            $rootScope.gotToken = false;
            $rootScope.securityConfigured = true;
            $rootScope.pageTopObj = {};
            $rootScope.userFullyVerified = false;
            localStorageManagement.deleteValue('TOKEN');
            $location.path('/login');
        };


    }
})();
