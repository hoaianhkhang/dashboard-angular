(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.details')
        .directive('editUserSwitch', editUserSwitch);

    /** @ngInject */
    function editUserSwitch() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/users/userDetails/userSwitches/editUserSwitch/editUserSwitch.html'
        };
    }
})();
