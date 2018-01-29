(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.currencyConversionService.currencyConversionList', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('currencyConversionService.currencyConversionList', {
                url: '/list',
                views: {
                    'currencyConversionServiceViews' : {
                        templateUrl:'app/pages/services/currencyConversionService/currencyConversionConversions/currencyConversionConversions.html',
                        controller: "CurrencyConversionConversionsCtrl"
                    }
                },
                title: 'Conversions list'
            });
    }

})();
