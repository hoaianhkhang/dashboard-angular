(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services', [
        'BlurAdmin.pages.services.ethereumService',
        "BlurAdmin.pages.services.bitcoinService",
        "BlurAdmin.pages.services.stellarService",
        'BlurAdmin.pages.services.notificationService',
        'BlurAdmin.pages.services.exchangeService',
        'BlurAdmin.pages.services.icoService',
        'BlurAdmin.pages.services.addService',
        'BlurAdmin.pages.services.currencyConversionService',
        'BlurAdmin.pages.services.rewardsService'
    ])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('services', {
                url: '/services',
                templateUrl: 'app/pages/services/services.html',
                controller: "ServicesCtrl",
                title: 'Services',
                sidebarMeta: {
                    order: 600
                }
            });
    }

})();
