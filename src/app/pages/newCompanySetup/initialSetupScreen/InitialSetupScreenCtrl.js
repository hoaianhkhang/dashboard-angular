(function () {
    'use strict';

    angular.module('BlurAdmin.pages.newCompanySetup.initialSetupScreen')
        .controller("InitialSetupScreenCtrl", InitialSetupScreenCtrl);

    function InitialSetupScreenCtrl($rootScope, $scope, $location,cookieManagement,userVerification) {
        var vm=this;
        vm.token=cookieManagement.getCookie("TOKEN");
        $rootScope.$pageFinishedLoading=true;

        $scope.goToNextView=function () {
            $rootScope.userFullyVerified = true;
            $location.path('company/setup/users');
        }
    }
})();
