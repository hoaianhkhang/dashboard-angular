(function () {
    'use strict';

    angular.module('BlurAdmin.pages.permissions', [
        'BlurAdmin.pages.permissions.groups'
    ])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('permissions', {
                url: '/user/:uuid/permissions-settings',
                templateUrl: 'app/pages/users/user/userDetails/permissions/permissions.html',
                controller: "PermissionsCtrl",
                title: 'Permissions'
            });
    }

})();