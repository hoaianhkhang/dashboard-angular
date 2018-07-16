(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.rewardsService.rewardsServiceRequests')
        .controller('RewardsServiceRequestsCtrl', RewardsServiceRequestsCtrl);

    /** @ngInject */
    function RewardsServiceRequestsCtrl($scope,$http,localStorageManagement,$uibModal,errorHandler) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.baseUrl = localStorageManagement.getValue('SERVICEURL');
        $scope.loadingLogs =  false;


    }
})();
