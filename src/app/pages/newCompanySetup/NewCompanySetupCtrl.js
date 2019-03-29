(function () {
    'use strict';

    angular.module('BlurAdmin.pages.newCompanySetup')
        .controller("NewCompanySetupCtrl", NewCompanySetupCtrl);

    function NewCompanySetupCtrl($rootScope, $scope, $location,localStorageManagement) {
        var vm=this;
        vm.token = localStorageManagement.getValue("token");
        $rootScope.dashboardTitle = 'Setup | Rehive';
        $scope.companySetupView = 'initialSetupScreen';
        $rootScope.setupCompany = localStorageManagement.getValue('setupCompany') || 0;
        $rootScope.setupUsers = localStorageManagement.getValue('setupUsers') || 0;
        $rootScope.setupCurrencies = localStorageManagement.getValue('setupCurrencies') || 0;
        $rootScope.setupAccounts = localStorageManagement.getValue('setupAccounts') || 0;
        $rootScope.setupSubtypes = localStorageManagement.getValue('setupSubtypes') || 0;
        $rootScope.activeSetupRoute = localStorageManagement.getValue('activeSetupRoute') || 0;


        $scope.goToView = function(path){
            $scope.companySetupView = '';
            $location.path(path);
        };

        $rootScope.skipAllView=function () {
            $location.path('/currencies');
        };

        $scope.backToLanding = function(){
            $rootScope.inVerification = true;
            // $location.path('/verification');
            $location.path('/template');
        };

    }
})();
