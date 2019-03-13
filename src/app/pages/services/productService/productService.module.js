(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.productService', [
        'BlurAdmin.pages.services.productService.productList',
        'BlurAdmin.pages.services.productService.createProduct',
        'BlurAdmin.pages.services.productService.editProduct',
        'BlurAdmin.pages.services.productService.productSettings',
        'BlurAdmin.pages.services.productService.ordersList',
        'BlurAdmin.pages.services.productService.createOrder',
        'BlurAdmin.pages.services.productService.editOrder'
    ])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('productService', {
                // url: '/services/product',
                url: '/extensions/product',
                abstract: true,
                templateUrl:'app/pages/services/productService/productService.html',
                controller: "ProductServiceCtrl"
            });
        // $urlRouterProvider.when("/services/product", "/services/product/list");
        $urlRouterProvider.when("/extensions/product", "/extensions/product/list");
    }

})();
