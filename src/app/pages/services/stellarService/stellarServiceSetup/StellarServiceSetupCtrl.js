(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarService.stellarServiceSetup')
        .controller('StellarServiceSetupCtrl', StellarServiceSetupCtrl);

    /** @ngInject */
    function StellarServiceSetupCtrl($rootScope,$scope,$http,localStorageManagement,toastr,errorHandler,$location) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.serviceUrl = localStorageManagement.getValue('SERVICEURL');
        $rootScope.dashboardTitle = 'Stellar service | Rehive';
        $scope.loadingStellarService = false;

        $scope.goToServices = function(){
            $location.path('/services');
        };


    }
})();
