(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.rewardsService.rewardsServiceLogs')
        .controller('RewardsServiceLogsCtrl', RewardsServiceLogsCtrl);

    /** @ngInject */
    function RewardsServiceLogsCtrl($scope,$http,localStorageManagement,$uibModal,errorHandler) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.baseUrl = localStorageManagement.getValue('SERVICEURL');
        $scope.loadingLogs =  false;


    }
})();
