(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groupUsers', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('groupUsers', {
                url: '/groups/:groupName/table',
                controller: 'GroupUsersCtrl',
                templateUrl: 'app/pages/groups/groupUsers/groupUsers.html',
                title: "Group Users"
            });
    }

})();
