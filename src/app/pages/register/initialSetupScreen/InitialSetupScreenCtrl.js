(function () {
    'use strict';

    angular.module('BlurAdmin.pages.initialSetupScreen')
        .controller("InitialSetupScreenCtrl", InitialSetupScreenCtrl);

    function InitialSetupScreenCtrl($rootScope, $scope, $location) {

        var vm = this;
        $rootScope.dashboardTitle = 'Setup | Rehive';
        $rootScope.$pageFinishedLoading=true;

        $scope.goToNextView=function () {
            $rootScope.userFullyVerified = true;
            $location.path('company/setup/groups');
        };
    }
})();
