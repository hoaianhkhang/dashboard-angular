(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.rewardsService.rewardsServiceCampaigns')
        .controller('RewardsServiceCampaignsCtrl', RewardsServiceCampaignsCtrl);

    /** @ngInject */
    function RewardsServiceCampaignsCtrl($scope,$rootScope,$http,localStorageManagement,$location,$uibModal,errorHandler) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.baseUrl = localStorageManagement.getValue('SERVICEURL');
        $scope.loadingCampaigns =  false;
        $scope.campaignList = [];

        $scope.campaignsId = '';

        $scope.closeCampaignOptionsBox = function () {
            $scope.campaignsId = '';
        };

        $scope.showCampaignOptionsBox = function (campaign) {
            $scope.campaignsId = campaign.identifier;
        };

        $scope.goToCreateCampaignView = function () {
            $location.path('/services/rewards/campaigns/create');
        };

        $scope.getCampaignList = function () {
            $scope.loadingCampaigns =  true;
            if(vm.token) {
                $http.get(vm.baseUrl + 'admin/campaigns/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $scope.loadingCampaigns =  false;
                        if(res.data.data.results.length > 0){
                            $scope.campaignListData = res.data.data;
                            $scope.campaignListData.results.forEach(function (campaign) {
                                campaign.start_date = moment(campaign.start_date).format('MM/DD/YYYY');
                                campaign.end_date = moment(campaign.end_date).format('MM/DD/YYYY');
                            });
                            $scope.campaignList = $scope.campaignListData.results;
                        }

                        console.log($scope.campaignList)
                    }
                }).catch(function (error) {
                    $scope.loadingCampaigns =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        $scope.getCampaignList();

        $scope.openEditCampaignView = function (campaign) {
            $location.path('/services/rewards/campaigns/' + campaign.identifier + '/edit');
        };


    }
})();
