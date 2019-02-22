(function () {
    'use strict';

    angular.module('BlurAdmin.pages.demoSetup')
        .controller("DemoSetupCtrl", DemoSetupCtrl);

    function DemoSetupCtrl($rootScope, $scope, $location,localStorageManagement) {
        var vm=this;
        vm.token = localStorageManagement.getValue("token");
        $rootScope.dashboardTitle = 'Demo setup | Rehive';
        $rootScope.securityConfigured = false;
        $rootScope.setupCompany = localStorageManagement.getValue('setupCompany') || 0;
        $rootScope.setupUsers = localStorageManagement.getValue('setupUsers') || 0;
        $rootScope.setupCurrencies = localStorageManagement.getValue('setupCurrencies') || 0;
        $rootScope.setupAccounts = localStorageManagement.getValue('setupAccounts') || 0;
        $rootScope.setupSubtypes = localStorageManagement.getValue('setupSubtypes') || 0;
        $rootScope.activeSetupRoute = localStorageManagement.getValue('activeSetupRoute') || 0;


        $scope.goToView = function(path){
            $location.path(path);
        };

        $rootScope.skipAllView=function () {
            $location.path('/currencies');
        };

    }
})();
