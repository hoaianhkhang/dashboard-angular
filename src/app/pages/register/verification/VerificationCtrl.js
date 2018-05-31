(function () {
    'use strict';

    angular.module('BlurAdmin.pages.verification')
        .controller('VerificationCtrl', VerificationCtrl);

    /** @ngInject */
    function VerificationCtrl($rootScope,Rehive,$scope,toastr,localStorageManagement,
                              $location,errorHandler,userVerification) {

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
            Rehive.user.get().then(function(res){
                vm.user = res;
                $scope.$apply();
            },function(error){
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };
        vm.getUserInfo();

        $scope.resendEmail = function(){
            Rehive.auth.email.resendEmailVerification({
                email: vm.user.email,
                company: vm.user.company
            }).then(function(res){
                toastr.success('Verification email has been re-sent');
                $scope.$apply();
            },function(error){
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

        $scope.logout = function () {
            $rootScope.dashboardTitle = 'Rehive';
            $rootScope.gotToken = false;
            $rootScope.securityConfigured = true;
            $rootScope.pageTopObj = {};
            $rootScope.userFullyVerified = false;
            localStorageManagement.deleteValue('TOKEN');
            localStorageManagement.deleteValue('token');
            $location.path('/login');
        };


    }
})();
