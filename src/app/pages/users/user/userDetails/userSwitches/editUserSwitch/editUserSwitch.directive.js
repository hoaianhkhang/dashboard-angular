(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .directive('editUserSwitch', editUserSwitch);

    /** @ngInject */
    function editUserSwitch() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/users/user/userDetails/userSwitches/editUserSwitch/editUserSwitch.html'
        };
    }
})();
