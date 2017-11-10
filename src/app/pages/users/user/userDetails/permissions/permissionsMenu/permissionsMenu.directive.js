(function () {
    'use strict';

    angular.module('BlurAdmin.pages.permissions')
        .directive('permissionsMenu', permissionsMenu);

    /** @ngInject */
    function permissionsMenu() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/users/user/userDetails/permissions/permissionsMenu/permissionsMenu.html'
        };
    }
})();
