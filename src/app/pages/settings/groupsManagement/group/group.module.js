(function () {
    'use strict';

    angular.module('BlurAdmin.pages.group', [
        'BlurAdmin.pages.group.permissions',
        'BlurAdmin.pages.group.settings',
        'BlurAdmin.pages.group.accountConfigurations',
        'BlurAdmin.pages.group.accountConfiguration'
    ])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('group', {
                url: '/settings/groups-management/:groupName',
                controller: 'GroupCtrl',
                templateUrl: 'app/pages/settings/groupsManagement/group/group.html',
                title: "Group"
            });
    }

})();
