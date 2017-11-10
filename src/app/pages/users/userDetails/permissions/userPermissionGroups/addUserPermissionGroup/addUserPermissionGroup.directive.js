(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.details')
        .directive('addUserPermissionGroupView', addUserPermissionGroupView);

    /** @ngInject */
    function addUserPermissionGroupView() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/users/userDetails/permissions/userPermissionGroups/addUserPermissionGroup/addUserPermissionGroup.html'
        };
    }
})();
