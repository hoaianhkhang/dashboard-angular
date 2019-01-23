(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.productService.productList')
        .controller('ProductCtrl', ProductCtrl);

    /** @ngInject */
    function ProductCtrl($scope,Rehive,$http,localStorageManagement,serializeFiltersService,
                          $location,$uibModal,errorHandler,$filter) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.serviceUrl = localStorageManagement.getValue('SERVICEURL');
        vm.companyIdentifier = localStorageManagement.getValue('companyIdentifier');
        vm.savedProductsTableColumns = vm.companyIdentifier + 'productServiceProductsTable';
        $scope.loadingProducts =  false;
        $scope.showingProductsFilters = false;
        $scope.showingProductsColumnFilters = false;
        $scope.productList = [];
        $scope.productListOptions = [];

        $scope.productPagination = {
            itemsPerPage: 25,
            pageNo: 1,
            maxSize: 5
        };

        // if(localStorageManagement.getValue(vm.savedProductsTableColumns)){
        //     var headerColumns = JSON.parse(localStorageManagement.getValue(vm.savedProductsTableColumns));
        //     headerColumns.forEach(function (col) {
        //         if(col.colName == 'Identifier'){
        //             col.colName = 'User id';
        //             col.fieldName = 'userId';
        //         }
        //     });
        //
        //     localStorageManagement.setValue(vm.savedProductsTableColumns,JSON.stringify(headerColumns));
        // }

        if(localStorageManagement.getValue(vm.savedProductsTableColumns)){
            var headerColumns = JSON.parse(localStorageManagement.getValue(vm.savedProductsTableColumns));
            var recipientFieldExists = false;
            headerColumns.forEach(function (col) {
                if(col.colName == 'Cost price'){
                    recipientFieldExists = true;
                }
            });

            if(!recipientFieldExists){
                headerColumns.splice(4,0,{colName: 'Cost price',fieldName: 'cost_price',visible: true});
            }

            localStorageManagement.setValue(vm.savedProductsTableColumns,JSON.stringify(headerColumns));
        }

        $scope.headerColumns = localStorageManagement.getValue(vm.savedProductsTableColumns) ? JSON.parse(localStorageManagement.getValue(vm.savedProductsTableColumns)) : [
            {colName: 'Id',fieldName: 'id',visible: true},
            {colName: 'Name',fieldName: 'name',visible: true},
            {colName: 'Description',fieldName: 'description',visible: true},
            {colName: 'Cost price',fieldName: 'cost_price',visible: true},
            {colName: 'Value',fieldName: 'value',visible: true},
            {colName: 'Currency',fieldName: 'currency',visible: true},
            {colName: 'Quantity',fieldName: 'quantity',visible: true},
            {colName: 'Type',fieldName: 'product_type',visible: true}
        ];

        $scope.filtersObj = {
            idFilter: false,
            nameFilter: false,
            currencyFilter: false,
            typeFilter: false
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
            },
            typeFilter: {
                selectedType: null
            }
        };

        $scope.clearFilters = function () {
            $scope.filtersObj = {
                idFilter: false,
                nameFilter: false,
                currencyFilter: false,
                typeFilter: false
            };
        };

        vm.getCompanyCurrencies = function(){
            if(vm.token){
                Rehive.admin.currencies.get({filters: {
                    page:1,
                    page_size: 250,
                    archived: false
                }}).then(function (res) {
                    $scope.currencyOptions = res.results.slice();
                    $scope.$apply();
                }, function (error) {
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.getCompanyCurrencies();

        $scope.showProductsFilters = function () {
            $scope.showingProductsColumnFilters = false;
            $scope.showingProductsFilters = !$scope.showingProductsFilters;
        };

        $scope.showProductsColumnFilters = function () {
            $scope.showingProductsFilters = false;
            $scope.showingProductsColumnFilters = !$scope.showingProductsColumnFilters;
        };

        $scope.closeProductsColumnFiltersBox = function () {
            $scope.showingProductsColumnFilters = false;
        };

        //Column filters
        $scope.selectAllProductsColumns = function () {
            $scope.headerColumns.forEach(function (headerObj) {
                headerObj.visible = true;
            });
            localStorageManagement.setValue(vm.savedProductsTableColumns,JSON.stringify($scope.headerColumns));
        };

        $scope.toggleProductsColumnVisibility = function () {
            localStorageManagement.setValue(vm.savedProductsTableColumns,JSON.stringify($scope.headerColumns));
        };

        $scope.restoreProductsColDefaults = function () {
            var defaultVisibleHeader = ['Id','Name','Description','Currency'];

            $scope.headerColumns.forEach(function (headerObj) {
                if(defaultVisibleHeader.indexOf(headerObj.colName) > -1){
                    headerObj.visible = true;
                } else {
                    headerObj.visible = false;
                }
            });

            localStorageManagement.setValue(vm.savedProductsTableColumns,JSON.stringify($scope.headerColumns));
        };
        //Column filters end

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
                            $scope.productListOptions = res.data.data.results;
                        }
                    }
                }).catch(function (error) {
                    $scope.loadingProducts =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        vm.getProductsList();

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
                page: $scope.productPagination.pageNo,
                page_size: $scope.productPagination.itemsPerPage || 25,
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
                $scope.productPagination.pageNo = 1;
            }

            if ($scope.productList.length > 0) {
                $scope.productList.length = 0;
            }

            var productUrl = vm.getProductsUrl();

            if(vm.token) {
                $http.get(productUrl, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        if(res.data.data.results.length > 0){
                            $scope.productListData = res.data.data;
                            vm.formatProductsArray($scope.productListData.results);
                        } else {
                            $scope.loadingProducts = false;
                        }
                    }
                }).catch(function (error) {
                    $scope.loadingProducts = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        $scope.getProductsLists();

        vm.formatProductsArray = function (productListArray) {
            productListArray.forEach(function (productObj) {
                $scope.productList.push({
                    id: productObj.id,
                    name: productObj.name,
                    description: productObj.description,
                    cost_price: productObj.cost_price ? $filter("currencyModifiersFilter")(productObj.cost_price,productObj.currency.divisibility) : '',
                    value: productObj.value ? $filter("currencyModifiersFilter")(productObj.value,productObj.currency.divisibility) : '',
                    currency: productObj.currency ? productObj.currency.code : null,
                    quantity: productObj.quantity,
                    product_type: productObj.product_type
                });
            });

            $scope.loadingProducts = false;
        };

        $scope.displayProduct = function (page,size,productObj) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'ShowProductModalCtrl',
                resolve: {
                    productObj: function () {
                        return productObj;
                    }
                }
            });

            vm.theModal.result.then(function(product){
                if(product){
                    $scope.getProductsLists();
                }
            }, function(){
            });
        };

        $scope.goToAddProduct =  function () {
            $location.path('/services/product/create');
        };

    }
})();
