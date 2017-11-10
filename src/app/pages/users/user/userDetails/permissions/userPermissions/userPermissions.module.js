(function () {
    'use strict';

    angular.module('BlurAdmin.pages.permissions.userPermissions', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('permissions.userPermissions', {
                url: '/user-permissions',
                title: 'User permissions',
                views:{
                    'permissionsView':{
                        templateUrl: 'app/pages/users/user/userDetails/permissions/userPermissions/userPermissions.html',
                        controller: "UserPermissionsCtrl"
                    }
                }
            });
    }

})();

