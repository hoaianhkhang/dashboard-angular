(function () {
    'use strict';

    angular.module('BlurAdmin.pages.group.permissions', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('group.permissions', {
                url: '/permissions',
                views: {
                    'groupViewManagement': {
                        controller: 'GeneralPermissionsCtrl',
                        templateUrl: 'app/pages/settings/groupsManagement/group/permissions/permissions.html'
                    }
                },
                title: "Permissions"
            });
    }

})();
