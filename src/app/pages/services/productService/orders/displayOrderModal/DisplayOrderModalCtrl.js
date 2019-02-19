(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.productService.ordersList')
        .controller('DisplayOrderModalCtrl', DisplayOrderModalCtrl);

    function DisplayOrderModalCtrl($scope,$http,order,localStorageManagement,errorHandler) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.serviceUrl = localStorageManagement.getValue('SERVICEURL');
        $scope.loadingOrder = false;
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
                        $scope.loadingOrder =  false;
                        $scope.orderObj = res.data.data;
                    }
                }).catch(function (error) {
                    $scope.loadingOrder =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        vm.getOrder();

    }
})();
