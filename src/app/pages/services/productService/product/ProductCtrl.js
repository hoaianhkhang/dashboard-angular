(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.productService.productList')
        .controller('ProductCtrl', ProductCtrl)
        .filter('excludeSelectedCurrencies', excludeSelectedCurrencies);

    /** @ngInject */
    function excludeSelectedCurrencies() {
        return function(list, ngModel, selectList) {
            var listLength = selectList.length;
            var output = [];

            angular.forEach(list, function(listItem){
                var enabled = true;
                for (var index = 0; index < listLength; ++index) {
                    console.log(selectList[index], ngModel, listItem);
                    if(selectList[index].currency.code !== ngModel.code && selectList[index].currency.code === listItem.code){
                        enabled = false;
                        break;
                    }
                }
                if(enabled){
                    output.push(listItem);
                }
            });

            return output;
        };
    }

    function ProductCtrl($scope,Rehive,$http,localStorageManagement,serializeFiltersService,
                         $ngConfirm,$location,$uibModal,errorHandler,toastr,$filter) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        // vm.serviceUrl = localStorageManagement.getValue('SERVICEURL');
        vm.serviceUrl = "https://product.services.rehive.io/api/";
        vm.companyIdentifier = localStorageManagement.getValue('companyIdentifier');
        vm.savedProductsTableColumns = vm.companyIdentifier + 'productServiceProductsTable';
        $scope.loadingProducts =  false;
        $scope.showingProductsFilters = false;
        $scope.showingProductsColumnFilters = false;
        $scope.productList = [];
        $scope.productId = '';
        $scope.enabledOptions = ['True','False'];

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

        // if(localStorageManagement.getValue(vm.savedProductsTableColumns)){
        //     var headerColumns = JSON.parse(localStorageManagement.getValue(vm.savedProductsTableColumns));
        //     var recipientFieldExists = false;
        //     headerColumns.forEach(function (col) {
        //         if(col.colName == 'Cost price'){
        //             recipientFieldExists = true;
        //         }
        //     });
        //
        //     if(!recipientFieldExists){
        //         headerColumns.splice(4,0,{colName: 'Cost price',fieldName: 'cost_price',visible: true});
        //     }
        //
        //     localStorageManagement.setValue(vm.savedProductsTableColumns,JSON.stringify(headerColumns));
        // }

        $scope.headerColumns = localStorageManagement.getValue(vm.savedProductsTableColumns) ? JSON.parse(localStorageManagement.getValue(vm.savedProductsTableColumns)) : [
            {colName: 'Product id',fieldName: 'id',visible: true},
            {colName: 'Name',fieldName: 'name',visible: true},
            {colName: 'Description',fieldName: 'description',visible: true},
            {colName: 'Quantity',fieldName: 'quantity',visible: true},
            {colName: 'Product type',fieldName: 'type',visible: true},
            {colName: 'Enabled',fieldName: 'enabled',visible: true},
            {colName: 'Created',fieldName: 'created',visible: true}
        ];

        $scope.filtersObj = {
            idFilter: false,
            nameFilter: false,
            quantityFilter: false,
            typeFilter: false,
            codeFilter: false,
            enabledFilter: false
        };
        $scope.applyFiltersObj = {
            idFilter: {
                selectedId: null
            },
            nameFilter: {
                selectedName: null
            },
            quantityFilter: {
                selectedQuantity: null
            },
            typeFilter: {
                selectedType: null
            },
            codeFilter: {
                selectedCode: null
            },
            enabledFilter: {
                selectedEnabled: 'True'
            }
        };

        $scope.clearFilters = function () {
            $scope.filtersObj = {
                idFilter: false,
                nameFilter: false,
                quantityFilter: false,
                typeFilter: false,
                codeFilter: false,
                enabledFilter: false
            };
        };

        // vm.getCompanyCurrencies = function(){
        //     if(vm.token){
        //         $http.get(vm.serviceUrl + 'admin/currencies/?page_size=250&archived=false', {
        //             headers: {
        //                 'Content-Type': 'application/json',
        //                 'Authorization': vm.token
        //             }
        //         }).then(function (res) {
        //             if (res.status === 200) {
        //                 $scope.currencyOptions = res.data.data.results.slice();
        //             }
        //         }).catch(function (error) {
        //             errorHandler.evaluateErrors(error.data);
        //             errorHandler.handleErrors(error);
        //         });
        //     }
        // };
        // vm.getCompanyCurrencies();

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

        $scope.showProductOptionsBox = function (product) {
            $scope.productId = product.id;
        };

        $scope.closeProductOptionsBox = function () {
            $scope.productId = '';
        };

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
                id: $scope.filtersObj.idFilter ? $scope.applyFiltersObj.idFilter.selectedId : null,
                name: $scope.filtersObj.nameFilter ? $scope.applyFiltersObj.nameFilter.selectedName : null,
                quantity: $scope.filtersObj.quantityFilter ? $scope.applyFiltersObj.quantityFilter.selectedQuantity : null,
                type: $scope.filtersObj.typeFilter ? $scope.applyFiltersObj.typeFilter.selectedType : null,
                code: $scope.filtersObj.codeFilter ? $scope.applyFiltersObj.codeFilter.selectedCode : null,
                enabled: $scope.filtersObj.enabledFilter ? ($scope.applyFiltersObj.enabledFilter.selectedEnabled == 'True'? 'true' : 'false') : null
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
                    name: productObj.name || '',
                    description: productObj.description || '',
                    quantity: productObj.quantity || '',
                    type: productObj.type || '',
                    created: $filter('date')(productObj.created,'MMM d, y') + ' ' +$filter('date')(productObj.created,'shortTime'),
                    enabled: productObj.enabled,
                    createdTime: productObj.created
                });
            });

            $scope.loadingProducts = false;
        };

        $scope.deleteProductConfirm = function (product) {
            $ngConfirm({
                title: 'Delete product',
                content: 'Are you sure you want to delete this product?',
                animationBounce: 1,
                animationSpeed: 100,
                scope: $scope,
                buttons: {
                    close: {
                        text: "Cancel",
                        btnClass: 'btn-default dashboard-btn'
                    },
                    Add: {
                        text: "Delete",
                        btnClass: 'btn-danger dashboard-btn',
                        keys: ['enter'], // will trigger when enter is pressed
                        action: function(scope){
                            $scope.deleteProduct(product);
                        }
                    }
                }
            });
        };

        $scope.deleteProduct = function (product) {
            if(vm.token) {
                $scope.loadingProducts = true;
                $http.delete(vm.serviceUrl + 'admin/products/' + product.id + '/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        toastr.success('Product successfully deleted');
                        $scope.getProductsLists();
                    }
                }).catch(function (error) {
                    $scope.loadingProducts =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.toggleProductStatus = function (product) {
            if(vm.token) {
                $http.patch(vm.serviceUrl + 'admin/products/' + product.id + '/',{enabled: product.enabled},{
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        toastr.success('Product successfully updated');
                    }
                }).catch(function (error) {
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.displayProductModal = function (page,size,productObj) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'DisplayProductModalCtrl',
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

        $scope.openEditProductView = function (product) {
            $location.path('/services/product/edit/' + product.id);
        };

        $scope.goToAddProduct =  function () {
            $location.path('/services/product/create');
        };

    }
})();
