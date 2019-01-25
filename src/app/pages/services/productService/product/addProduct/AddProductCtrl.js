(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.productService.createProduct')
        .controller('AddProductCtrl', AddProductCtrl);

    /** @ngInject */
    function AddProductCtrl($scope,$http,$location,localStorageManagement,currencyModifiers,
                            Rehive,serializeFiltersService,toastr,errorHandler) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.serviceUrl = localStorageManagement.getValue('SERVICEURL');
        $scope.addingProduct = false;
        $scope.newProductParams = {
            name: '',
            description: '',
            quantity: '',
            type: '',
            code: '',
            prices: [],
            enabled: true
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

        $scope.addNewProduct = function (newProductParams) {
            var newProduct = {
                name: newProductParams.name,
                description: newProductParams.description,
                quantity: newProductParams.quantity || null,
                type: newProductParams.type || null,
                code: newProductParams.code || null,
                enabled: newProductParams.enabled.toString() || null
            };

            newProduct = serializeFiltersService.objectFilters(newProduct);

            $scope.addingProduct =  true;
            if(vm.token) {
                $http.post(vm.serviceUrl + 'admin/products/',newProduct, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 201 || res.status === 200) {
                        if($scope.newProductParams.prices.length > 0){
                            vm.formatPricesForProduct(res.data.data);
                        } else{
                            toastr.success('Product added successfully');
                            $location.path('/services/product/list');
                        }
                    }
                }).catch(function (error) {
                    $scope.addingProduct =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.formatPricesForProduct = function (product) {
            $scope.newProductParams.prices.forEach(function(price,idx,array){
                if(idx === array.length - 1){
                    vm.addPricesToProduct(product,{currency: price.currency.code,amount: currencyModifiers.convertToCents(price.amount,price.currency.divisibility)},'last');
                    return false;
                }
                vm.addPricesToProduct(product,{currency: price.currency.code,amount: currencyModifiers.convertToCents(price.amount,price.currency.divisibility)});
            });
        };

        vm.addPricesToProduct = function (product,priceObj,last) {
            if(vm.token) {
                $http.post(vm.serviceUrl + 'admin/products/' + product.id + '/prices/',priceObj, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 201 || res.status === 200) {
                        if(last){
                            toastr.success('Product added successfully');
                            $location.path('/services/product/list');
                        }
                    }
                }).catch(function (error) {
                    $scope.addingProduct =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.addPriceRow = function () {
            var priceObj = {
                currency: $scope.currencyOptions[($scope.currencyOptions.length - 1)],
                amount: 10
            };
            $scope.newProductParams.prices.push(priceObj);
        };

        $scope.backToProductList = function () {
            $location.path('/services/product/list');
        };

    }
})();
