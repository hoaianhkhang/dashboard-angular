(function () {
    'use strict';

    angular.module('BlurAdmin.pages.developers.statusPage', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('developers.statusPage', {
                url: '/status-page',
                controller: function () {

                },
                title: "Status page",
                sidebarMeta: {
                    icon: 'fa fa-external-link',
                    order: 400
                }
            });
    }

})();
