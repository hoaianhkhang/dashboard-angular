(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.productsService.createProduct')
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
            currency: {},
            value: '',
            cost_price: '',
            quantity: '',
            product_type: '',
            code: ''
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
                currency: newProductParams.currency.code || null,
                value: currencyModifiers.convertToCents(newProductParams.value,newProductParams.currency.divisibility) || null,
                cost_price: currencyModifiers.convertToCents(newProductParams.cost_price,newProductParams.currency.divisibility) || null,
                quantity: newProductParams.quantity || null,
                product_type: newProductParams.product_type || null,
                code: newProductParams.code || null
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
                        toastr.success('Product added successfully');
                        $location.path('/services/products/list');
                    }
                }).catch(function (error) {
                    $scope.addingProduct =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.backToProductsList = function () {
            $location.path('/services/products/list');
        };

    }
})();
