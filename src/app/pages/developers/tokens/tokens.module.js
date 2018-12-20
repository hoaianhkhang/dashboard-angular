(function () {
    'use strict';

    angular.module('BlurAdmin.pages.developers.tokens', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('developers.tokens', {
                url: '/tokens',
                controller: 'TokensCtrl',
                templateUrl: 'app/pages/developers/tokens/tokens.html',
                title: "Api tokens",
                sidebarMeta: {
                    order: 100
                }
            });
    }

})();
