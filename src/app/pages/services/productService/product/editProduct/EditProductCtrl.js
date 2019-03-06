(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.productService.editProduct')
        .controller('EditProductCtrl', EditProductCtrl);

    /** @ngInject */
    function EditProductCtrl($scope,$http,$location,localStorageManagement,$stateParams,
                             Rehive,currencyModifiers,toastr,$filter,errorHandler) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.serviceUrl = localStorageManagement.getValue('SERVICEURL');
        vm.productId = $stateParams.productId;
        $scope.editingProduct = false;
        $scope.editProductObj = {};
        vm.updatedProduct = {};
        $scope.pricesDeleted = [];

        vm.getCompanyCurrencies = function(){
            if(vm.token){
                $scope.editingProduct = true;
                $http.get(vm.serviceUrl + 'admin/currencies/?page_size=250&archived=false', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $scope.currencyOptions = res.data.data.results.slice();
                        vm.getProduct();
                    }
                }).catch(function (error) {
                    $scope.editingProduct = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        vm.getCompanyCurrencies();

        // Rehive.admin.currencies.get({filters: {
        //     page:1,
        //     page_size: 250,
        //     archived: false
        // }}).then(function (res) {
        //     $scope.currencyOptions = res.results.slice();
        //     vm.getProduct();
        //     $scope.$apply();
        // }, function (error) {
        //     $scope.editingProduct = false;
        //     errorHandler.evaluateErrors(error);
        //     errorHandler.handleErrors(error);
        //     $scope.$apply();
        // });

        vm.getProduct = function () {
            if(vm.token) {
                $scope.editingProduct = true;
                $http.get(vm.serviceUrl + 'admin/products/' + vm.productId + '/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        vm.assignProductToScope(res.data.data);
                    }
                }).catch(function (error) {
                    $scope.editingProduct = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.assignProductToScope = function (editObj) {
            $scope.editProductObj = {
                id: editObj.id,
                name: editObj.name,
                description: editObj.description,
                quantity: editObj.quantity,
                type: editObj.type,
                code: editObj.code,
                enabled: editObj.enabled,
                prices: []
            };

            editObj.prices.forEach(function (price) {
                $scope.currencyOptions.forEach(function (currency) {
                    if(currency.code == price.currency.code){
                        $scope.editProductObj.prices.push({
                            id: price.id,
                            currency: currency,
                            amount: price.amount ? $filter("currencyModifiersFilter")(price.amount,currency.divisibility) : 0,
                            disable: true
                        });
                    }
                });
            });

            $scope.editingProduct = false;
        };

        $scope.addEditPriceRow = function () {
            // var priceObj = {
            //     currency: $scope.currencyOptions[($scope.currencyOptions.length - 1)],
            //     amount: 10,
            //     type: 'add'
            // };
            // $scope.editProductObj.prices.push(priceObj);
            $scope.editProductObj.prices.push({currency: {}, amount: 10});
        };

        $scope.removePriceRow = function (price) {
            $scope.editProductObj.prices.forEach(function (priceObj,index,array) {
                if(priceObj.id == price.id){
                    price.type = 'delete';
                    $scope.pricesDeleted.push(price);
                    array.splice(index,1);
                }
            });
        };

        $scope.priceChanged = function (price) {
            $scope.editProductObj.prices.forEach(function (priceObj) {
                if(priceObj.id == price.id){
                    if(price.type != 'add'){
                        price.type = 'change';
                    }
                }
            });
        };

        $scope.productChanged = function(field){
            vm.updatedProduct[field] = $scope.editProductObj[field];
        };

        $scope.editProduct = function () {
            if(vm.token) {
                $scope.editingProduct = true;
                $http.patch(vm.serviceUrl + 'admin/products/' + vm.productId + '/',vm.updatedProduct, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        vm.trackPricesChanges();
                    }
                }).catch(function (error) {
                    $scope.editingProduct = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.trackPricesChanges = function () {
            var pricesAdded = [];
            var pricesChanged = [];

            $scope.editProductObj.prices.forEach(function (priceObj,indx,array) {
                if(indx === (array.length - 1)){

                    if(priceObj.type == 'change'){
                        pricesChanged.push(priceObj);
                    } else if(priceObj.type == 'add'){
                        pricesAdded.push(priceObj);
                    }

                    vm.executeDeletePricesArray(pricesAdded,pricesChanged);
                    return false;
                }

                if(priceObj.type == 'change'){
                    pricesChanged.push(priceObj);
                } else if(priceObj.type == 'add'){
                    pricesAdded.push(priceObj);
                }
            });
        };

        vm.executeDeletePricesArray = function (pricesAdded,pricesChanged) {
            if($scope.pricesDeleted.length > 0){
                $scope.pricesDeleted.forEach(function(price,idx,array){
                    if(idx === array.length - 1){
                        vm.deletePrice(price,'last',pricesAdded,pricesChanged);
                        return false;
                    }
                    vm.deletePrice(price);
                });
            } else {
                vm.executeChangePricesArray(pricesAdded,pricesChanged);
            }
        };

        vm.deletePrice = function (priceObj,last,pricesAdded,pricesChanged) {
            if(priceObj && priceObj.id) {
                $http.delete(vm.serviceUrl + 'admin/products/' + vm.productId + '/prices/' + priceObj.id + '/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 201 || res.status === 200) {
                        if(last){
                            vm.executeChangePricesArray(pricesAdded,pricesChanged);
                        }
                    }
                }).catch(function (error) {
                    $scope.editingProduct =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            } else {
                if(last){
                    vm.executeChangePricesArray(pricesAdded,pricesChanged);
                }
            }
        };

        vm.executeChangePricesArray = function (pricesAdded,pricesChanged) {
            if(pricesChanged.length > 0){
                pricesChanged.forEach(function(price,idx,array){
                    if(idx === array.length - 1){
                        vm.updateChangedPrice(price,{amount: currencyModifiers.convertToCents(price.amount,price.currency.divisibility)},'last',pricesAdded);
                        return false;
                    }
                    vm.updateChangedPrice(price,{amount: currencyModifiers.convertToCents(price.amount,price.currency.divisibility)});
                });
            } else {
                vm.executeAddPricesArray(pricesAdded);
            }
        };

        vm.updateChangedPrice = function (price,priceUpdateObj,last,pricesAdded) {
            if(vm.token) {
                $http.patch(vm.serviceUrl + 'admin/products/' + vm.productId + '/prices/' + price.id + '/',priceUpdateObj, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 201 || res.status === 200) {
                        if(last){
                            vm.executeAddPricesArray(pricesAdded);
                        }
                    }
                }).catch(function (error) {
                    $scope.editingProduct =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.executeAddPricesArray = function (pricesAdded) {
            if(pricesAdded.length > 0){
                pricesAdded.forEach(function(price,idx,array){
                    if(idx === array.length - 1){
                        vm.addPrice({currency: price.currency.code,amount: currencyModifiers.convertToCents(price.amount,price.currency.divisibility)},'last');
                        return false;
                    }
                    vm.addPrice({currency: price.currency.code,amount: currencyModifiers.convertToCents(price.amount,price.currency.divisibility)});
                });
            } else {
                toastr.success('Product successfully updated');
                // $location.path('/services/product/list');
                $location.path('/extensions/product/list');
            }
        };

        vm.addPrice = function (priceObj,last) {
            if(vm.token) {
                $http.post(vm.serviceUrl + 'admin/products/' + vm.productId + '/prices/',priceObj, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 201 || res.status === 200) {
                        if(last){
                            toastr.success('Product successfully updated');
                            // $location.path('/services/product/list');
                            $location.path('/extensions/product/list');
                        }
                    }
                }).catch(function (error) {
                    $scope.editingProduct =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.backToProductList = function () {
            // $location.path('/services/product/list');
            $location.path('/extensions/product/list');
        };

    }
})();
