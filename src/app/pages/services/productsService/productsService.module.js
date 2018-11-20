(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.productsService', [
        'BlurAdmin.pages.services.productsService.productsList',
        'BlurAdmin.pages.services.productsService.createProduct',
        'BlurAdmin.pages.services.productsService.productsSettings'
    ])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('productsService', {
                url: '/services/products',
                abstract: true,
                templateUrl:'app/pages/services/productsService/productsService.html',
                controller: "ProductsServiceCtrl"
            });
        $urlRouterProvider.when("/services/products", "/services/products/list");
    }

})();
