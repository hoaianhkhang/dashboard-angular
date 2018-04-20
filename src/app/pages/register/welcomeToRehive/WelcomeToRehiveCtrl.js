(function () {
    'use strict';

    angular.module('BlurAdmin.pages.welcomeToRehive')
        .controller('WelcomeToRehiveCtrl', WelcomeToRehiveCtrl);

    /** @ngInject */
    function WelcomeToRehiveCtrl($rootScope,$scope,$location) {

        var vm = this;
        vm.user = {};
        $rootScope.dashboardTitle = 'Setup | Rehive';
        $scope.verifyingEmail = false;
        $rootScope.$pageFinishedLoading = true;

        $scope.goToNextView = function () {
            $location.path('/company/info_request');
        };
    }
})();
