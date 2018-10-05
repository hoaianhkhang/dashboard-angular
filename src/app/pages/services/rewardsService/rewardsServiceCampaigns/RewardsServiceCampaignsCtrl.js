(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.rewardsService.rewardsServiceCampaigns')
        .controller('RewardsServiceCampaignsCtrl', RewardsServiceCampaignsCtrl);

    /** @ngInject */
    function RewardsServiceCampaignsCtrl($scope,$http,localStorageManagement,$location,
                                         serializeFiltersService,$ngConfirm,toastr,errorHandler) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.serviceUrl = localStorageManagement.getValue('SERVICEURL');
        $scope.loadingCampaigns =  false;
        $scope.campaignList = [];
        $scope.filtersCount = 0;
        $scope.campaignsId = '';
        $scope.showingFilters = false;

        $scope.closeCampaignOptionsBox = function () {
            $scope.campaignsId = '';
        };

        $scope.showCampaignOptionsBox = function (campaign) {
            $scope.campaignsId = campaign.id;
        };

        $scope.goToCreateCampaignView = function () {
            $location.path('/services/rewards/campaigns/create');
        };

        $scope.campaignPagination = {
            itemsPerPage: 25,
            pageNo: 1,
            maxSize: 5
        };
        $scope.filtersObj = {
            nameFilter: false,
            idFilter: false
        };
        $scope.applyFiltersObj = {
            nameFilter: {
                selectedName: ''
            },
            idFilter: {
                selectedId: ''
            }
        };

        $scope.clearFilters = function () {
            $scope.filtersObj = {
                nameFilter: false,
                idFilter: false
            };
        };

        $scope.showFilters = function () {
            $scope.showingFilters = !$scope.showingFilters;
        };

        vm.getRewardsCampaignsListsUrl = function(){
            $scope.filtersCount = 0;

            for(var x in $scope.filtersObj){
                if($scope.filtersObj.hasOwnProperty(x)){
                    if($scope.filtersObj[x]){
                        $scope.filtersCount = $scope.filtersCount + 1;
                    }
                }
            }

            var searchObj = {
                page: $scope.campaignPagination.pageNo,
                page_size: $scope.campaignPagination.itemsPerPage || 25,
                name: $scope.filtersObj.nameFilter ? $scope.applyFiltersObj.nameFilter.selectedName : null,
                id: $scope.filtersObj.idFilter ? $scope.applyFiltersObj.idFilter.selectedId : null
            };

            return vm.serviceUrl + 'admin/campaigns/?' + serializeFiltersService.serializeFilters(searchObj);
        };

        $scope.getCampaignList = function (applyFilter) {
            if(vm.token) {
                $scope.loadingCampaigns =  true;
                $scope.showingFilters = false;

                if (applyFilter) {
                    // if function is called from history-filters directive, then pageNo set to 1
                    $scope.campaignPagination.pageNo = 1;
                }

                if ($scope.campaignList.length > 0) {
                    $scope.campaignList.length = 0;
                }

                var rewardsCampaignsListsUrl = vm.getRewardsCampaignsListsUrl();

                $http.get(rewardsCampaignsListsUrl, {
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
                                campaign.start_date = moment(campaign.start_date).format('DD/MM/YYYY');
                                campaign.end_date = moment(campaign.end_date).format('DD/MM/YYYY');
                            });
                            $scope.campaignList = $scope.campaignListData.results;
                        }
                    }
                }).catch(function (error) {
                    $scope.loadingCampaigns =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        $scope.getCampaignList();

        $scope.deleteCampaignPrompt = function(campaign) {
            $ngConfirm({
                title: 'Delete campaign',
                contentUrl: 'app/pages/services/rewardsService/rewardsServiceCampaigns/deleteCampaignPrompt.html',
                animationBounce: 1,
                animationSpeed: 100,
                scope: $scope,
                buttons: {
                    Add: {
                        text: "Delete",
                        btnClass: 'btn-default dashboard-btn',
                        keys: ['enter'], // will trigger when enter is pressed
                        action: function(scope){
                            if(scope.deleteText === 'DELETE'){
                                scope.deleteCampaign(campaign.id);
                            } else {
                                toastr.error('DELETE text did not match.');
                            }
                        }
                    },
                    close: {
                        text: "Cancel",
                        btnClass: 'btn-primary dashboard-btn'
                    }
                }
            });
        };

        $scope.deleteCampaign = function (campaignId) {
            if(vm.token) {
                $scope.loadingCampaigns = true;
                $http.delete(vm.serviceUrl + 'admin/campaigns/' + campaignId + '/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        toastr.success('Reward campaign has been successfully deleted');
                        $scope.getCampaignList();
                    }
                }).catch(function (error) {
                    $scope.loadingCampaigns =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.openEditCampaignView = function (campaign) {
            $location.path('/services/rewards/campaigns/' + campaign.id + '/edit');
        };


    }
})();
