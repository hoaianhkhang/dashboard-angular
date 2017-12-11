(function () {
    'use strict';

    angular.module('BlurAdmin.pages.webhooks.logs', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('webhooks.logs', {
                url: '/logs',
                views: {
                    'webhooksView': {
                        templateUrl: 'app/pages/webhooks/webhookLogs/webhookLogs.html',
                        controller: "WebhookLogsCtrl"
                    }
                },
                title: 'Webhooks'
            });
    }

})();