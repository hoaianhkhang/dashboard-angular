(function () {
    'use strict';

    angular.module('BlurAdmin.pages.demoSetup')
        .controller("DemoSetupCtrl", DemoSetupCtrl);

    function DemoSetupCtrl($intercom, $rootScope, $scope, demoSetupService) {

        $intercom.update({});
        $scope.companyName = "";
        $rootScope.dashboardTitle = 'Demo setup | Rehive';
        $rootScope.securityConfigured = false;
        $rootScope.settingUpDemo = false;

        $scope.initializeDemoSetup = function(){
            $rootScope.settingUpDemo = true;
            demoSetupService.initializeDemoSetup($scope.companyName);
        };
    }
})();
