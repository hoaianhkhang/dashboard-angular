(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.productsService.products')
        .controller('ProductsCtrl', ProductsCtrl);

    /** @ngInject */
    function ProductsCtrl($scope,$rootScope,$http,localStorageManagement,serializeFiltersService,$uibModal,errorHandler) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.serviceUrl = localStorageManagement.getValue('SERVICEURL');
        $scope.loadingProducts =  false;
        $scope.showingProductsFilters = false;
        $scope.showingProductsColumnFilters = false;
        $scope.productsList = [];
        $scope.productsListOptions = [];

        $scope.productsPagination = {
            itemsPerPage: 25,
            pageNo: 1,
            maxSize: 5
        };

        $scope.filtersObj = {
            idFilter: false,
            nameFilter: false,
            currencyFilter: false
        };
        $scope.applyFiltersObj = {
            idFilter: {
                selectedId: null
            },
            nameFilter: {
                selectedName: null
            },
            currencyFilter: {
                selectedCurrency: {}
            }
        };

        $scope.showProductsFilters = function () {
            $scope.showingProductsColumnFilters = false;
            $scope.showingProductsFilters = !$scope.showingProductsFilters;
        };

        $scope.showProductsColumnFilters = function () {
            $scope.showingProductsFilters = false;
            $scope.showingProductsColumnFilters = !$scope.showingProductsColumnFilters;
        };

        vm.getProductsList = function () {
            if(vm.token) {
                $http.get(vm.serviceUrl + 'admin/products/?page_size=250', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        if(res.data.data.results.length > 0){
                            console.log(res.data.data)
                            $scope.productsListOptions = res.data.data.results;
                        }
                    }
                }).catch(function (error) {
                    $scope.loadingProducts =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        //vm.getProductsList();

        vm.getProductsUrl = function(){
            $scope.filtersCount = 0;

            for(var x in $scope.filtersObj){
                if($scope.filtersObj.hasOwnProperty(x)){
                    if($scope.filtersObj[x]){
                        $scope.filtersCount = $scope.filtersCount + 1;
                    }
                }
            }

            var searchObj = {
                page: $scope.productsPagination.pageNo,
                page_size: $scope.productsPagination.itemsPerPage || 25,
                campaign: $scope.filtersObj.campaignFilter ? ($scope.applyFiltersObj.campaignFilter.selectedCampaign ? $scope.applyFiltersObj.campaignFilter.selectedCampaign.id : null): null,
                id: $scope.filtersObj.rewardIdFilter ? $scope.applyFiltersObj.rewardIdFilter.selectedRewardId : null,
                reward_type: $scope.filtersObj.rewardTypeFilter ? ($scope.applyFiltersObj.rewardTypeFilter.selectedRewardType ? $scope.applyFiltersObj.rewardTypeFilter.selectedRewardType.toLowerCase() : null): null,
                status: $scope.filtersObj.statusFilter ? ($scope.applyFiltersObj.statusFilter.selectedStatus ? $scope.applyFiltersObj.statusFilter.selectedStatus.toLowerCase() : null): null
            };

            return vm.serviceUrl + 'admin/products/?' + serializeFiltersService.serializeFilters(searchObj);
        };

        $scope.getProductsLists = function (applyFilter) {
            $scope.loadingProducts = true;

            $scope.showingProductsFilters = false;

            if (applyFilter) {
                // if function is called from history-filters directive, then pageNo set to 1
                $scope.productsPagination.pageNo = 1;
            }

            if ($scope.productsList.length > 0) {
                $scope.productsList.length = 0;
            }

            var productsUrl = vm.getProductsUrl();

            if(vm.token) {
                $http.get(productsUrl, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $scope.loadingProducts = false;
                        if(res.data.data.results.length > 0){
                            $scope.productsListData = res.data.data;
                            $scope.productsList = $scope.productsListData.results;
                        }
                    }
                }).catch(function (error) {
                    $scope.loadingProducts = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        //$scope.getProductsLists();


    }
})();
