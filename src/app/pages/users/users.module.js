(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users', [
        'BlurAdmin.pages.users.user'
    ])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('users', {
                url: '/users',
                templateUrl: 'app/pages/users/users.html',
                params: {
                    currencyCode: null
                },
                controller: "UsersCtrl",
                title: 'Users',
                sidebarMeta: {
                    order: 300
                }
            });
    }

})();