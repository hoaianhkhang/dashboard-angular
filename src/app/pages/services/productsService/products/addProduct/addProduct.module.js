(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.productsService.createProduct', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('productsService.createProduct', {
                url: '/create',
                views: {
                    'productsServiceViews' : {
                        templateUrl:'app/pages/services/productsService/products/addProduct/addProduct.html',
                        controller: "AddProductCtrl"
                    }
                },
                title: 'Products'
            });
    }

})();
