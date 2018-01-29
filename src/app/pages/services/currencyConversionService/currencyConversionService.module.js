(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.currencyConversionService', [
        'BlurAdmin.pages.services.currencyConversionService.currencyConversionRates',
        'BlurAdmin.pages.services.currencyConversionService.currencyConversionQuotes',
        'BlurAdmin.pages.services.currencyConversionService.currencyConversionList'
    ])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('currencyConversionService', {
                url: '/services/conversion',
                abstract: true,
                template:'<div ui-view="currencyConversionServiceViews"></div>'
            });
        $urlRouterProvider.when("/services/conversion", "/services/conversion/rates");
    }

})();
