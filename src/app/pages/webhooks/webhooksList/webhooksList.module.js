(function () {
    'use strict';

    angular.module('BlurAdmin.pages.webhooks.list', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('webhooks.list', {
                url: '/list',
                params: {
                    secret: null,
                    webhookUrl: null
                },
                views: {
                    'webhooksView': {
                        templateUrl: 'app/pages/webhooks/webhooksList/webhooksList.html',
                        controller: "WebhooksListCtrl"
                    }
                },
                title: 'Webhooks'
            });
    }

})();