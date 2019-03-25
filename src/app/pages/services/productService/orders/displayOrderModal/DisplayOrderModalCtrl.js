(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.productService.ordersList')
        .controller('DisplayOrderModalCtrl', DisplayOrderModalCtrl);

    function DisplayOrderModalCtrl($rootScope, $uibModalInstance, $scope,$http,order,localStorageManagement,errorHandler,toastr, $location) {

        var vm = this, extensionsList = JSON.parse(localStorageManagement.getValue('extensionsList'));
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.orderStatus = "";
        vm.serviceUrl = extensionsList[79];
        // vm.serviceUrl = "https://product.services.rehive.io/api/";
        $scope.loadingOrder = false;
        $scope.editingOrder = false;
        $scope.orderChanged = false;
        $scope.disablePending = false;
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
                        if($scope.orderObj.status == "failed" || $scope.orderObj.status == "complete"){
                            $scope.disablePending = true;
                        }
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
                        $scope.closeModal();
                    }
                }).catch(function (error) {
                    $scope.editingOrder =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.closeModal = function () {
            $uibModalInstance.close(true);
            $location.path('/services/product/orders');
        };
    }
})();
