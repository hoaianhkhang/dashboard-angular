(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.productService.editOrder')
        .controller('EditOrderCtrl', EditOrderCtrl);

    function EditOrderCtrl($scope,$http,$location,localStorageManagement,currencyModifiers,
                          Rehive,serializeFiltersService,toastr,errorHandler,typeaheadService,
                           $stateParams) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.serviceUrl = localStorageManagement.getValue('SERVICEURL');
        vm.orderId = $stateParams.orderId;
        $scope.editingOrder = false;
        $scope.loadingProducts = false;
        $scope.loadingUser = false;
        $scope.productList = [];
        $scope.products = [];
        $scope.currencyOptions= [];
        $scope.editOrderObj = {
            user: null,
            status: "pending",
            currency: "",
            total_price: 0,
            items: []
        };
        $scope.getUsersEmailTypeahead = typeaheadService.getUsersEmailTypeahead();

        vm.getCompanyCurrencies = function(){
            if(vm.token){
                Rehive.admin.currencies.get({filters: {
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

        vm.getProductsList = function () {
            if(vm.token) {
                $scope.loadingProducts = true;
                $http.get(vm.serviceUrl + 'admin/products/?page_size=250', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $scope.loadingProducts = false;
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

        vm.getUser = function(editObj){
            if(vm.token){
                vm.loadingUser = true;
                Rehive.admin.users.get({filters: {user: editObj.user}}).then(function (res) {
                    vm.loadingUser = false;
                    editObj.user =  res.results[0].email;
                    vm.assignOrderToScope(editObj);
                    $scope.$apply();
                }).catch(function (error) {
                    vm.loadingUser = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        vm.getOrder = function(){
            if(vm.token){
                $scope.editingOrder = true;
                $http.get(vm.serviceUrl + 'admin/orders/' + vm.orderId + '/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        vm.getUser(res.data.data);
                    }
                }).catch(function (error) {
                    $scope.editingOrder = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.getOrder();

        vm.assignOrderToScope = function(editObj){
            $scope.editOrderObj = {
                id: editObj.id,
                user: editObj.user,
                status: editObj.status,
                currency: null,
                total_price: editObj.total_price,
                items: []
            };

            for(var i = 0; i < $scope.currencyOptions.length; ++i){
                if(editObj.currency.code === $scope.currencyOptions[i].code){
                    $scope.editOrderObj.currency = $scope.currencyOptions[i];
                    break;
                }
            }

            var itemProduct = null;
            $scope.updateProductList();
            editObj.items.forEach(function (item) {
                for(var i = 0; i < $scope.products.length; ++i){
                    if($scope.products[i].id === item.product){
                        itemProduct = $scope.products[i];
                        break;
                    }
                }
                $scope.editOrderObj.items.push({
                    id: item.id,
                    product: itemProduct,
                    quantity: item.quantity
                });
            });

            $scope.editingOrder = false;
        };

        $scope.editOrder = function (editOrderObj) {

            var updatedOrder = serializeFiltersService.objectFilters($scope.editOrderObj);

            $scope.editingOrder =  true;
            if(vm.token) {
                Rehive.admin.users.get({filters: {user: editOrderObj.user}}).then(function (res) {
                    updatedOrder.user = res.results[0].id;
                    $http.post(vm.serviceUrl + 'admin/orders/' + vm.orderId + '/', updatedOrder, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': vm.token
                        }
                    }).then(function (res) {
                        if (res.status === 201 || res.status === 200) {
                            if($scope.editOrderObj.items.length > 0){
                                vm.formatItemsForOrder(res.data.data);
                            } else{
                                toastr.success('Order added successfully');
                                $location.path('/services/product/orders');
                            }
                        }
                    }).catch(function (error) {
                        $scope.editingOrder =  false;
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
            $scope.editOrderObj.items.forEach(function(orderItem,idx,array){
                if(idx === array.length - 1){
                    vm.editOrderItems(order,{product: orderItem.product.id, quantity: orderItem.quantity},'last');
                    return false;
                }
                vm.editOrderItems(order,{product: orderItem.product.id, quantity: orderItem.quantity});
            });
        };

        vm.editOrderItems = function (order,orderItem,last) {
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
                            $scope.editingOrder =  false;
                        }
                    }
                }).catch(function (error) {
                    $scope.editingOrder =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.updateProductList = function(){
            $scope.products = [];
            for(var i = 0; i < $scope.productList.length; ++i){
                for(var j = 0; j < $scope.productList[i].prices.length; ++j){
                    if($scope.productList[i].prices[j].currency.code === $scope.editOrderObj.currency.code && $scope.productList[i].enabled === true){
                        $scope.products.push($scope.productList[i]);
                    }
                }
            }
        };

        // $scope.deleteExistingItem = function(item){
        //     $http.delete(vm.serviceUrl + 'admin/orders/' + vm.orderId + '/items/' + item.id + '/', {
        //         headers: {
        //             'Content-Type': 'application/json',
        //             'Authorization': vm.token
        //         }
        //     }).then(function (res) {
        //         toastr.success('Item deleted successfully');
        //
        //     }).catch(function (error) {
        //         errorHandler.evaluateErrors(error.data);
        //         errorHandler.handleErrors(error);
        //     });
        // };

        $scope.addOrderItem = function () {
            var item = {
                product: $scope.products[($scope.products.length - 1)],
                quantity: 1
            };
            $scope.editOrderObj.items.push(item);
        };

        $scope.removeAddOrderItem = function(item){
            $scope.editOrderObj.items.forEach(function (itemObj,index,array) {
                if(itemObj.product.id === item.product.id){
                    array.splice(index,1);
                }
            });
        };

        $scope.backToOrderList = function () {
            $location.path('/services/product/orders');
        };

    }
})();
