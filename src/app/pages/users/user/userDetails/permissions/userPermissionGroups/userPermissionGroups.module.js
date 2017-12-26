(function () {
    'use strict';

    angular.module('BlurAdmin.pages.permissions.permissionGroups', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('permissions.permissionGroups', {
                url: '/permission-groups',
                title: 'Permission groups',
                views:{
                    'permissionsView':{
                        templateUrl: 'app/pages/users/user/userDetails/permissions/userPermissionGroups/userPermissionGroups.html',
                        controller: "UserPermissionGroupsCtrl"
                    }
                }
            });
    }

})();
