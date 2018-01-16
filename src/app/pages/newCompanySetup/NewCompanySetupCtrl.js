(function () {
    'use strict';

    angular.module('BlurAdmin.pages.newCompanySetup')
        .controller("NewCompanySetupCtrl", NewCompanySetupCtrl);

    function NewCompanySetupCtrl($rootScope, $scope, $location,cookieManagement,userVerification) {
        var vm=this;
        vm.token=cookieManagement.getCookie("TOKEN");
        $scope.companySetupView = 'initialSetupScreen';
        $scope.goToView = function(path){
            $scope.companySetupView = '';
            $location.path(path);
        };
    }
})();
