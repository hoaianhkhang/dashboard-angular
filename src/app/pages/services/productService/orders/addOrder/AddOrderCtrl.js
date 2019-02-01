(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.productService.createOrder')
        .controller('AddOrderCtrl', AddOrderCtrl);

    function AddOrderCtrl($scope,$http,$location,localStorageManagement,currencyModifiers,
                          Rehive,serializeFiltersService,toastr,errorHandler,typeaheadService) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.serviceUrl = localStorageManagement.getValue('SERVICEURL');
        $scope.addingOrder = false;
        $scope.loadingProducts = false;
        $scope.productList = [];
        $scope.products = [];
        $scope.currencyOptions= [];
        $scope.newOrderParams = {
            user: null,
            status: "pending",
            currency: null,
            total_price: 0,
            items: []
        };

        $scope.getUsersEmailTypeahead = typeaheadService.getUsersEmailTypeahead();

        vm.getCompanyCurrencies = function(){
            if(vm.token){
                $http.get(vm.serviceUrl + 'admin/currencies/?page_size=250&archived=false', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $scope.currencyOptions = res.data.data.results.slice();
                    }
                }).catch(function (error) {
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        vm.getCompanyCurrencies();

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
                            $scope.productList = res.data.data.results;
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

        $scope.addNewOrder = function (newOrderParams) {
            var newOrder = {
                user: null,
                currency: newOrderParams.currency.code
            };
            newOrder = serializeFiltersService.objectFilters(newOrder);

            $scope.addingOrder =  true;
            if(vm.token) {
                Rehive.admin.users.get({filters: {user: newOrderParams.user}}).then(function (res) {

                    newOrder.user = res.results[0].id;
                    $http.post(vm.serviceUrl + 'admin/orders/', newOrder, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': vm.token
                        }
                    }).then(function (res) {
                        if (res.status === 201 || res.status === 200) {
                            if($scope.newOrderParams.items.length > 0){
                                vm.formatItemsForOrder(res.data.data);
                            } else{
                                toastr.success('Order added successfully');
                                $location.path('/services/product/orders');
                            }
                        }
                    }).catch(function (error) {
                        $scope.addingOrder =  false;
                        errorHandler.evaluateErrors(error.data);
                        errorHandler.handleErrors(error);
                    });
                }, function (error) {
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.formatItemsForOrder = function (order) {
            $scope.newOrderParams.items.forEach(function(orderItem,idx,array){
                if(idx === array.length - 1){
                    vm.addOrderItems(order,{product: orderItem.product.id, quantity: orderItem.quantity},'last');
                    return false;
                }
                vm.addOrderItems(order,{product: orderItem.product.id, quantity: orderItem.quantity});
            });
        };

        vm.addOrderItems = function (order,orderItem,last) {
            if(vm.token) {
                $http.post(vm.serviceUrl + 'admin/orders/' + order.id + '/items/', orderItem, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 201 || res.status === 200) {
                        if(last){
                            toastr.success('Order added successfully');
                            $location.path('/services/product/orders');
                        }
                    }
                }).catch(function (error) {
                    $scope.addingOrder =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.updateProductList = function(){
            $scope.products = [];
            for(var i = 0; i < $scope.productList.length; ++i){
                for(var j = 0; j < $scope.productList[i].prices.length; ++j){
                    if($scope.productList[i].prices[j].currency.code == $scope.newOrderParams.currency.code && $scope.productList[i].enabled == true){
                        $scope.products.push($scope.productList[i]);
                    }
                }
            }
        };

        $scope.addOrderItem = function () {
            var item = {
                product: $scope.products[($scope.products.length - 1)],
                quantity: 1
            };
            $scope.newOrderParams.items.push(item);
        };

        $scope.removeAddOrderItem = function(item){
            $scope.newOrderParams.items.forEach(function (itemObj,index,array) {
                itemObj.product ? (itemObj.product.name == item.product.name) ? array.splice(index,1) : null : array.splice(index,1);
            });
        };

        $scope.backToOrderList = function () {
            $location.path('/services/product/orders');
        };
    }
})();
