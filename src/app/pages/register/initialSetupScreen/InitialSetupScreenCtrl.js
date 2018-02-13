(function () {
    'use strict';

    angular.module('BlurAdmin.pages.initialSetupScreen')
        .controller("InitialSetupScreenCtrl", InitialSetupScreenCtrl);

    function InitialSetupScreenCtrl($rootScope, $scope, $location,cookieManagement) {
        var vm=this;
        vm.token=cookieManagement.getCookie("TOKEN");
        $rootScope.dashboardTitle = 'Setup | Rehive';
        $rootScope.$pageFinishedLoading=true;

        $scope.goToNextView=function () {
            $rootScope.userFullyVerified = true;
            $location.path('company/setup/groups');
        };
    }
})();
