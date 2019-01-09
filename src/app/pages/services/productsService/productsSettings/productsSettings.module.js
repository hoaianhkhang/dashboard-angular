(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.productsService.productsSettings', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('productsService.productsSettings', {
                url: '/settings',
                views: {
                    'productsServiceViews' : {
                        templateUrl:'app/pages/services/productsService/productsSettings/productsSettings.html',
                        controller: "ProductsSettingsCtrl"
                    }
                },
                title: 'Settings'
            });
    }

})();
