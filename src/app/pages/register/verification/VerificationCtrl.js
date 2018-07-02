(function () {
    'use strict';

    angular.module('BlurAdmin.pages.verification')
        .controller('VerificationCtrl', VerificationCtrl);

    /** @ngInject */
    function VerificationCtrl($rootScope,$scope,$http,toastr,environmentConfig,
                              localStorageManagement,$location,errorHandler,userVerification,_) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        $scope.user = {};
        $scope.verifyingEmail = false;
        $rootScope.$pageFinishedLoading = false;

        vm.checkIfUserVerified = function(){
            userVerification.verify(function(err,verified){
                if(verified){
                    $location.path('/welcome_to_rehive');
                } else {
                    vm.getUserInfo();
                }
            });
        };
        vm.checkIfUserVerified();

        $scope.verifyUser = function(){
            $location.path('/welcome_to_rehive');
        };

        vm.getUserInfo = function(){
            $http.get(environmentConfig.API + '/user/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                if (res.status === 200) {
                    $scope.user = res.data.data;
                    $rootScope.$pageFinishedLoading = true;
                }
            }).catch(function (error) {
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        $scope.resendEmail = function(){
            $http.post(environmentConfig.API + '/auth/email/verify/resend/',{email: $scope.user.email,company: $scope.user.company}, {
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
            localStorageManagement.deleteValue('TOKEN');
            $location.path('/login');
        };


    }
})();
