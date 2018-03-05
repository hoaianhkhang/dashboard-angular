(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groups', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('groups', {
                url: '/groups',
                controller: 'GroupsOverviewCtrl',
                templateUrl: 'app/pages/groups/groupsOverview/groupsOverview.html',
                title: "Groups",
                sidebarMeta: {
                    order: 600
                }
            });
    }

})();
