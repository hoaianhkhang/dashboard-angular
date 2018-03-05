(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groups', [
        'BlurAdmin.pages.groups.overview'
    ])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('groups', {
                url: '/groups',
                templateUrl: 'app/pages/groups/groups.html',
                controller: function($location){
                    $location.path('/groups/overview');
                },
                title: 'Groups',
                sidebarMeta: {
                    order: 600
                }
            });
    }

})();