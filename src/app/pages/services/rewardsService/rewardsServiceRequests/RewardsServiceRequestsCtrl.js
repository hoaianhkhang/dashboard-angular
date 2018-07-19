(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.rewardsService.rewardsServiceRequests')
        .controller('RewardsServiceRequestsCtrl', RewardsServiceRequestsCtrl);

    /** @ngInject */
    function RewardsServiceRequestsCtrl($scope,$http,localStorageManagement,
                                        $uibModal,environmentConfig,serializeFiltersService,errorHandler) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.baseUrl = localStorageManagement.getValue('SERVICEURL');
        $scope.loadingRewardsRequests =  false;
        $scope.showingRewardsRequestsFilters = false;
        $scope.rewardsRequestsList = [];

        $scope.filtersObj = {
            campaignFilter: false,
            statusFilter: false
        };
        $scope.applyFiltersObj = {
            campaignFilter: {
                selectedCampaign: null
            },
            statusFilter: {
                selectedStatus: null
            }
        };

        $scope.showRewardsRequestsFilters = function () {
            $scope.showingRewardsRequestsFilters = !$scope.showingRewardsRequestsFilters;
        };

        $scope.pagination = {
            itemsPerPage: 25,
            pageNo: 1,
            maxSize: 5
        };

        vm.getRewardsRequestsUrl = function(){
            $scope.filtersCount = 0;

            for(var x in $scope.filtersObj){
                if($scope.filtersObj.hasOwnProperty(x)){
                    if($scope.filtersObj[x]){
                        $scope.filtersCount = $scope.filtersCount + 1;
                    }
                }
            }

            var searchObj = {
                page: $scope.pagination.pageNo,
                page_size: $scope.pagination.itemsPerPage || 1
                // user: $scope.filtersObj.userFilter ? ($scope.applyFiltersObj.userFilter.selectedUserOption ? encodeURIComponent($scope.applyFiltersObj.userFilter.selectedUserOption) : null): null,
                // key: $scope.filtersObj.keyFilter ? ($scope.applyFiltersObj.keyFilter.selectedKey ? $scope.applyFiltersObj.keyFilter.selectedKey : null): null
            };

            return vm.baseUrl + 'admin/campaigns/requests/?' + serializeFiltersService.serializeFilters(searchObj);
        };

        $scope.getRewardsRequests = function (applyFilter) {
            $scope.loadingRewardsRequests = true;

            $scope.showingRewardsRequestsFilters = false;

            if (applyFilter) {
                // if function is called from history-filters directive, then pageNo set to 1
                $scope.pagination.pageNo = 1;
            }

            if ($scope.rewardsRequestsList.length > 0) {
                $scope.rewardsRequestsList.length = 0;
            }

            var rewardsRequestsUrl = vm.getRewardsRequestsUrl();

            if(vm.token) {
                $http.get(rewardsRequestsUrl, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $scope.loadingRewardsRequests = false;
                        if(res.data.data.results.length > 0){
                            $scope.rewardsRequestData = res.data.data;
                            $scope.rewardsRequestsList = $scope.rewardsRequestData.results;
                        }
                    }
                }).catch(function (error) {
                    $scope.loadingRewardsRequests = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        $scope.getRewardsRequests();

        $scope.openRewardRequestModal = function (page, size,request) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'RewardsServiceRequestsModalCtrl',
                resolve: {
                    request: function () {
                        return request;
                    }
                }
            });

            vm.theModal.result.then(function(){

            }, function(){
            });
        };
    }
})();
