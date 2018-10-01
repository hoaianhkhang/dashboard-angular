(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.productsService', [
        'BlurAdmin.pages.services.productsService.products'
    ])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('productsService', {
                url: '/services/product',
                abstract: true,
                templateUrl:'app/pages/services/productsService/productsService.html',
                controller: "ProductsServiceCtrl"
            });
        $urlRouterProvider.when("/services/product", "/services/product/products");
    }

})();
