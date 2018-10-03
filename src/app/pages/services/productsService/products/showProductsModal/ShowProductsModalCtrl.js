(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.productsService.productsList')
        .controller('ShowProductModalCtrl', ShowProductModalCtrl);

    function ShowProductModalCtrl($scope,$stateParams,$uibModalInstance,serializeFiltersService,$ngConfirm,Rehive,
                                  toastr,$http,productObj,currencyModifiers,localStorageManagement,errorHandler) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.serviceUrl = localStorageManagement.getValue('SERVICEURL');
        vm.groupName = $stateParams.groupName;
        $scope.productObj = productObj;
        $scope.deletingProduct = false;
        $scope.editingProduct = false;
        vm.updatedProduct = {};

        vm.getCompanyCurrencies = function(){
            if(vm.token){
                $scope.deletingProduct = true;
                Rehive.admin.currencies.get({filters: {
                    page:1,
                    page_size: 250,
                    archived: false
                }}).then(function (res) {
                    $scope.currencyOptions = res.results.slice();
                    $scope.getProducts();
                    $scope.$apply();
                }, function (error) {
                    $scope.deletingProduct = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.getCompanyCurrencies();

        $scope.getProducts = function(){
            if(vm.token) {
                $scope.deletingProduct = true;
                $http.get(vm.serviceUrl + 'admin/products/' + productObj.id + '/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $scope.deletingProduct =  false;
                        $scope.productObject = res.data.data;
                        if($scope.currencyOptions.length > 0){
                            $scope.currencyOptions.forEach(function (currency) {
                                if(currency.code == $scope.productObject.currency){
                                    $scope.productObject.currency = currency;
                                }
                            });
                        }
                    }
                }).catch(function (error) {
                    $scope.deletingProduct =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.toggleEditingProduct = function () {
            $scope.editingProduct = !$scope.editingProduct;
        };

        $scope.productChanged = function(field){
            vm.updatedProduct[field] = $scope.productObject[field];
        };

        $scope.updateProduct = function () {
            $scope.deletingProduct = true;

            var updatedProduct = {
                name: vm.updatedProduct.name,
                description: vm.updatedProduct.description,
                currency: vm.updatedProduct.currency.code || null,
                value: currencyModifiers.convertToCents(vm.updatedProduct.value,vm.updatedProduct.currency.divisibility) || null,
                cost_price: currencyModifiers.convertToCents(vm.updatedProduct.cost_price,vm.updatedProduct.currency.divisibility) || null,
                quantity: vm.updatedProduct.quantity || null,
                product_type: vm.updatedProduct.product_type || null,
                code: vm.updatedProduct.code || null
            };

            updatedProduct = serializeFiltersService.objectFilters(updatedProduct);

            $http.patch(vm.serviceUrl + 'admin/products/' + $scope.productObject.id + '/', updatedProduct, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                if (res.status === 200) {
                    toastr.success('Product successfully updated');
                    $uibModalInstance.close(true);
                }
            }).catch(function (error) {
                $scope.deletingProduct =  false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        $scope.deleteProductConfirm = function () {
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
                            $scope.deleteProduct();
                        }
                    }
                }
            });
        };

        $scope.deleteProduct = function () {
            if(vm.token) {
                $scope.deletingProduct = true;
                $http.delete(vm.serviceUrl + 'admin/products/' + $scope.productObject.id + '/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        toastr.success('Product successfully deleted');
                        $uibModalInstance.close(true);
                    }
                }).catch(function (error) {
                    $scope.deletingProduct =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };


    }
})();
