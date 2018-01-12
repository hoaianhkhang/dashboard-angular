(function () {
    'use strict';

    angular.module('BlurAdmin.pages.welcomeToRehive')
        .controller('WelcomeToRehiveCtrl', WelcomeToRehiveCtrl);

    /** @ngInject */
    function WelcomeToRehiveCtrl($rootScope,$scope,$http,toastr,cookieManagement,environmentConfig,$location,errorHandler,userVerification,_) {

        var vm = this;
        vm.user = {};
        vm.token = cookieManagement.getCookie('TOKEN');
        $scope.verifyingEmail = false;
        $rootScope.$pageFinishedLoading = true;

        $scope.goToNextView = function () {
            $location.path('/company/name_request');
        }
    }
})();
