(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.productsService.products', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('productsService.products', {
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
