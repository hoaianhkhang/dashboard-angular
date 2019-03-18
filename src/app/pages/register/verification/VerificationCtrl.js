(function () {
    'use strict';

    angular.module('BlurAdmin.pages.verification')
        .controller('VerificationCtrl', VerificationCtrl);

    /** @ngInject */
    function VerificationCtrl($rootScope,Rehive,$scope,toastr,localStorageManagement,
                              $location,errorHandler,userVerification,$intercom) {

        $intercom.update({});
        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        $scope.companyName = "";
        // $scope.user = {};
        // $scope.verifyingEmail = false;
        $rootScope.dashboardTitle = 'Welcome | Rehive';
        // $rootScope.$pageFinishedLoading = false;
        $rootScope.inVerification = true;



    /**
        vm.checkIfUserVerified = function(){
            userVerification.verify(function(err,verified){
                if(verified){
                    $location.path('/company/setup/initial');
                } else {
                    vm.getUserInfo();
                }
            });
        };
        vm.checkIfUserVerified();

        $scope.verifyUser = function(){
            $location.path('/company/setup/initial');
        };

        vm.getUserInfo = function(){
            Rehive.user.get().then(function(res){
                $scope.user = res;
                $rootScope.$pageFinishedLoading = true;
                $rootScope.$apply();
            },function(error){
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $rootScope.$apply();
            });
        };

        $scope.resendEmail = function(){
            Rehive.auth.email.resendEmailVerification({
                email: $scope.user.email,
                company: $scope.user.company
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
            $intercom.shutdown();
            localStorageManagement.deleteValue('TOKEN');
            localStorageManagement.deleteValue('token');
            Rehive.removeToken();
            $location.path('/login');
        };
    **/

    }
})();
