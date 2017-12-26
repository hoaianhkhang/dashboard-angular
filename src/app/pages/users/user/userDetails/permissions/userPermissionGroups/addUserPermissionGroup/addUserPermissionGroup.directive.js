(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .directive('addUserPermissionGroupView', addUserPermissionGroupView);

    /** @ngInject */
    function addUserPermissionGroupView() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/users/user/userDetails/permissions/userPermissionGroups/addUserPermissionGroup/addUserPermissionGroup.html'
        };
    }
})();
