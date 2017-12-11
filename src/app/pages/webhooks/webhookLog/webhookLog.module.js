(function () {
    'use strict';

    angular.module('BlurAdmin.pages.webhooks.log', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('webhooks.log', {
                url: '/logs/:id',
                views: {
                    'webhooksView': {
                        templateUrl: 'app/pages/webhooks/webhookLog/webhookLog.html',
                        controller: "WebhookLogCtrl"
                    }
                },
                title: 'Webhooks'
            });
    }

})();