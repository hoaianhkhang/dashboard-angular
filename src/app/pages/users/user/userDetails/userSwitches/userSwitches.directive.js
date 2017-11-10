(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .directive('userSwitches', userSwitches);

    /** @ngInject */
    function userSwitches() {
        return {
            restrict: 'E',
            controller: 'UserSwitchesCtrl',
            templateUrl: 'app/pages/users/user/userDetails/userSwitches/userSwitches.html'
        };
    }
})();