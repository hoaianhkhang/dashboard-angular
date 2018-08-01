(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.rewardsService.rewardsServiceRequests')
        .controller('RewardsServiceRequestsCtrl', RewardsServiceRequestsCtrl);

    /** @ngInject */
    function RewardsServiceRequestsCtrl(environmentConfig,$scope,$http,localStorageManagement,
                                        $uibModal,serializeFiltersService,errorHandler,toastr) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.serviceUrl = localStorageManagement.getValue('SERVICEURL');
        $scope.loadingRewardsRequests =  false;
        $scope.showingRewardsRequestsFilters = false;
        $scope.rewardsRequestsList = [];
        $scope.statusOptions = ['Pending','Accept','Reject'];

        $scope.filtersObj = {
            campaignFilter: false,
            statusFilter: false
        };
        $scope.applyFiltersObj = {
            campaignFilter: {
                selectedCampaign: null
            },
            statusFilter: {
                selectedStatus: 'Pending'
            }
        };

        $scope.showRewardsRequestsFilters = function () {
            $scope.showingRewardsRequestsFilters = !$scope.showingRewardsRequestsFilters;
        };

        $scope.getUserObjEmail = function (identifier) {
            $http.get(environmentConfig.API + '/admin/users/?user=' + identifier, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                if (res.status === 200) {
                    if(res.data.data.results.length == 1){
                        $scope.userEmailObj = res.data.data.results[0];
                    }
                }
            }).catch(function (error) {
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
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
                page_size: $scope.pagination.itemsPerPage || 25,
                campaign: $scope.filtersObj.campaignFilter ? ($scope.applyFiltersObj.campaignFilter.selectedCampaign ? $scope.applyFiltersObj.campaignFilter.selectedCampaign : null): null,
                status: $scope.filtersObj.statusFilter ? ($scope.applyFiltersObj.statusFilter.selectedStatus ? $scope.applyFiltersObj.statusFilter.selectedStatus.toLowerCase() : null): null
            };

            return vm.serviceUrl + 'admin/campaigns/requests/?' + serializeFiltersService.serializeFilters(searchObj);
        };

        $scope.getRewardsRequests = function (applyFilter,fromRequestStatusChange) {
            if(!fromRequestStatusChange){
                $scope.loadingRewardsRequests = true;
            }

            $scope.showingRewardsRequestsFilters = false;

            if (applyFilter) {
                // if function is called from history-filters directive, then pageNo set to 1
                $scope.pagination.pageNo = 1;
            }

            if ($scope.rewardsRequestsList.length > 0 && !fromRequestStatusChange) {
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

        $scope.clearFilters = function () {
            $scope.filtersObj = {
                campaignFilter: false,
                statusFilter: false
            };
        };

        $scope.requestStatusChange = function (request,status) {
            if(vm.token) {
                $http.patch(vm.serviceUrl + 'admin/campaigns/requests/' + request.identifier + '/',
                    {
                        status: status.toLowerCase()
                    }, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': vm.token
                        }
                    }).then(function (res) {
                    if (res.status === 200) {
                        $scope.getRewardsRequests(null,'fromRequestStatusChange');
                        toastr.success('Request has been updated successfully');
                    }
                }).catch(function (error) {
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

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

            vm.theModal.result.then(function(request){
                if(request){
                    $scope.getRewardsRequests();
                }
            }, function(){
            });
        };
    }
})();
