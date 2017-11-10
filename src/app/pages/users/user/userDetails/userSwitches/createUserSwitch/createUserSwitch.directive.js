(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .directive('createUserSwitch', createUserSwitch);

    /** @ngInject */
    function createUserSwitch() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/users/user/userDetails/userSwitches/createUserSwitch/createUserSwitch.html'
        };
    }
})();
