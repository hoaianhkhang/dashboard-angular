(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.productsService.productsList', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('productsService.productsList', {
                url: '/list',
                views: {
                    'productsServiceViews' : {
                        templateUrl:'app/pages/services/productsService/products/products.html',
                        controller: "ProductsCtrl"
                    }
                },
                title: 'Products'
            });
    }

})();
