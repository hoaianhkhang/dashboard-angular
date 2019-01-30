(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.productService.productList')
        .controller('DisplayProductModalCtrl', DisplayProductModalCtrl);

    function DisplayProductModalCtrl($scope,$http,productObj,localStorageManagement,errorHandler) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.serviceUrl = localStorageManagement.getValue('SERVICEURL');
        $scope.loadingProduct = false;

        vm.getProduct = function(){
            if(vm.token) {
                $scope.loadingProduct = true;
                $http.get(vm.serviceUrl + 'admin/products/' + productObj.id + '/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $scope.loadingProduct =  false;
                        $scope.productObj = res.data.data;
                    }
                }).catch(function (error) {
                    $scope.loadingProduct =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        vm.getProduct();

    }
})();
