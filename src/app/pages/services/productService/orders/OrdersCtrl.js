(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.productService.ordersList')
        .controller('OrdersCtrl', OrdersCtrl);

    /** @ngInject */
    function OrdersCtrl($scope,Rehive,$http,localStorageManagement,serializeFiltersService,
                        $location,$uibModal,errorHandler,$filter) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.serviceUrl = localStorageManagement.getValue('SERVICEURL');
        vm.companyIdentifier = localStorageManagement.getValue('companyIdentifier');
        $scope.loadingOrders = false;
        $scope.ordersFiltersCount = 0;
        $scope.showingOrdersFilters = false;
        $scope.ordersList = [];

        $scope.ordersPagination = {
            itemsPerPage: 25,
            pageNo: 1,
            maxSize: 5
        };

        $scope.ordersFiltersObj = {
            idFilter: false,
            nameFilter: false,
            currencyFilter: false,
            typeFilter: false
        };
        $scope.applyOrdersFiltersObj = {
            idFilter: {
                selectedId: null
            },
            nameFilter: {
                selectedName: null
            },
            currencyFilter: {
                selectedCurrency: {}
            },
            typeFilter: {
                selectedType: null
            }
        };

        $scope.clearOrdersFilters = function () {
            $scope.ordersFiltersObj = {
                idFilter: false,
                nameFilter: false,
                currencyFilter: false,
                typeFilter: false
            };
        };

        $scope.showOrdersFilters = function () {
            $scope.showingOrdersFilters = !$scope.showingOrdersFilters;
        };

        vm.getOrdersUrl = function(){
            $scope.ordersFiltersCount = 0;

            for(var x in $scope.ordersFiltersObj){
                if($scope.ordersFiltersObj.hasOwnProperty(x)){
                    if($scope.ordersFiltersObj[x]){
                        $scope.ordersFiltersCount = $scope.ordersFiltersCount + 1;
                    }
                }
            }

            var searchObj = {
                page: $scope.ordersPagination.pageNo,
                page_size: $scope.ordersPagination.itemsPerPage || 25,
                campaign: $scope.ordersFiltersObj.campaignFilter ? ($scope.applyOrdersFiltersObj.campaignFilter.selectedCampaign ? $scope.applyOrdersFiltersObj.campaignFilter.selectedCampaign.id : null): null,
                id: $scope.ordersFiltersObj.rewardIdFilter ? $scope.applyOrdersFiltersObj.rewardIdFilter.selectedRewardId : null,
                reward_type: $scope.ordersFiltersObj.rewardTypeFilter ? ($scope.applyOrdersFiltersObj.rewardTypeFilter.selectedRewardType ? $scope.applyOrdersFiltersObj.rewardTypeFilter.selectedRewardType.toLowerCase() : null): null,
                status: $scope.ordersFiltersObj.statusFilter ? ($scope.applyOrdersFiltersObj.statusFilter.selectedStatus ? $scope.applyOrdersFiltersObj.statusFilter.selectedStatus.toLowerCase() : null): null
            };

            return vm.serviceUrl + 'admin/orders/?' + serializeFiltersService.serializeFilters(searchObj);
        };

        $scope.getOrdersLists = function (applyFilter) {
            $scope.loadingOrders = true;

            $scope.showingOrdersFilters = false;

            if (applyFilter) {
                // if function is called from history-filters directive, then pageNo set to 1
                $scope.ordersPagination.pageNo = 1;
            }

            if ($scope.ordersList.length > 0) {
                $scope.ordersList.length = 0;
            }

            var ordersUrl = vm.getOrdersUrl();

            if(vm.token) {
                $http.get(ordersUrl, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        if(res.data.data.results.length > 0){
                            $scope.ordersListData = res.data.data;
                            $scope.ordersList = $scope.ordersListData.results;
                        } else {
                            $scope.loadingOrders = false;
                        }
                    }
                }).catch(function (error) {
                    $scope.loadingOrders = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        $scope.getOrdersLists();

    }
})();
