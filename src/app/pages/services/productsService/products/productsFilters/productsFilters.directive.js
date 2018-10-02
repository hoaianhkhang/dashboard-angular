(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.productsService.productsList')
        .directive('productsFilters', productsFilters);

    /** @ngInject */
    function productsFilters() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/productsService/products/productsFilters/productsFilters.html'
        };
    }
})();