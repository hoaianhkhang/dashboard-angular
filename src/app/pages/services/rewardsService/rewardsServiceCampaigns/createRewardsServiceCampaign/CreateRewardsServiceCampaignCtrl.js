(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.rewardsService.createRewardsServiceCampaign')
        .controller('CreateRewardsServiceCampaignsCtrl', CreateRewardsServiceCampaignsCtrl);

    /** @ngInject */
    function CreateRewardsServiceCampaignsCtrl($scope,$rootScope,$http,localStorageManagement,$location,$uibModal,errorHandler) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.baseUrl = localStorageManagement.getValue('SERVICEURL');

        $scope.addingCampaign =  false;
        $scope.newCampaignParams = {};


    }
})();
