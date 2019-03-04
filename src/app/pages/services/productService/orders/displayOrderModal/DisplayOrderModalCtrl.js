(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.productService.ordersList')
        .controller('DisplayOrderModalCtrl', DisplayOrderModalCtrl);

    function DisplayOrderModalCtrl($scope,$http,order,localStorageManagement,errorHandler,toastr, $location) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.serviceUrl = localStorageManagement.getValue('SERVICEURL');
        vm.orderStatus = "";
        $scope.loadingOrder = false;
        $scope.editingOrder = false;
        $scope.orderChanged = false;
        $scope.orderObj = {};

        vm.getOrder = function(){
            if(vm.token) {
                $scope.loadingOrder = true;
                $http.get(vm.serviceUrl + 'admin/orders/' + order.id + '/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        console.log(res.data.data);
                        $scope.loadingOrder =  false;
                        $scope.orderObj = res.data.data;
                        vm.orderStatus = $scope.orderObj.status;
                    }
                }).catch(function (error) {
                    $scope.loadingOrder =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        vm.getOrder();

        $scope.toggleEditingOrder = function(){
            $scope.editingOrder = !$scope.editingOrder;
        };

        $scope.orderStatusChanged = function(){
          if(vm.orderStatus !== $scope.orderObj.status){
              $scope.orderChanged = true;
          } else {
              $scope.orderChanged = false;
          }
        };

        $scope.updateOrderStatus = function(){
            console.log($scope.orderObj);
            if(vm.token && $scope.orderChanged){
                $http.patch(vm.serviceUrl + 'admin/orders/' + order.id + '/',
                    {status: $scope.orderObj.status}, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': vm.token
                        }
                    }).then(function (res) {
                    if (res.status === 201 || res.status === 200) {
                        $scope.editingOrder =  false;
                        toastr.success('Order status updated successfully');
                        $location.path('/services/product/orders');
                    }
                }).catch(function (error) {
                    $scope.editingOrder =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
    }
})();
