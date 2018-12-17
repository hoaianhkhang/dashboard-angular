(function () {
    'use strict';

    angular.module('BlurAdmin.pages.accessControl', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('accessControl', {
                url: '/access-control',
                templateUrl: 'app/pages/accessControl/accessControl.html',
                controller: "AccessControlCtrl",
                title: 'Access control',
                sidebarMeta: {
                    order: 700
                }
            });
    }

})();
