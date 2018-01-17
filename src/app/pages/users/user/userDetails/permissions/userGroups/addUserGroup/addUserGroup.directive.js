(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .directive('addUserGroupView', addUserGroupView);

    /** @ngInject */
    function addUserGroupView() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/users/user/userDetails/permissions/userGroups/addUserGroup/addUserGroup.html'
        };
    }
})();
