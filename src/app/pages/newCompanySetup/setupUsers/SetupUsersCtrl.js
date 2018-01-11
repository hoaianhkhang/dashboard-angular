(function () {
    'use strict';

    angular.module('BlurAdmin.pages.newCompanySetup.setupUsers')
        .controller("SetupUsersCtrl", SetupUsersCtrl);

    function SetupUsersCtrl($rootScope, $scope, $location,cookieManagement,userVerification) {
        var vm=this;
        vm.token=cookieManagement.getCookie("TOKEN");
        $rootScope.$pageFinishedLoading=true;

        $scope.goToNextView=function () {
            $rootScope.userVerified=true;
            $location.path('currency/add/initial');
        }
    }
})();
