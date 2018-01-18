(function () {
    'use strict';

    angular.module('BlurAdmin.pages.webhooks', [
        'BlurAdmin.pages.webhooks.list',
        'BlurAdmin.pages.webhooks.logs',
        'BlurAdmin.pages.webhooks.log'
    ])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('webhooks', {
                url: '/webhooks',
                templateUrl: 'app/pages/webhooks/webhooks.html',
                controller: "WebhooksCtrl",
                title: 'Webhooks',
                sidebarMeta: {
                    order: 500
                }
            });
    }

})();
