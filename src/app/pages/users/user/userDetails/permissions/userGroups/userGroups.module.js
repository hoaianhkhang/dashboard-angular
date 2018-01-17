(function () {
    'use strict';

    angular.module('BlurAdmin.pages.permissions.groups', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('permissions.groups', {
                url: '/groups',
                title: 'Groups',
                views:{
                    'permissionsView':{
                        templateUrl: 'app/pages/users/user/userDetails/permissions/userGroups/userGroups.html',
                        controller: "UserGroupsCtrl"
                    }
                }
            });
    }

})();
