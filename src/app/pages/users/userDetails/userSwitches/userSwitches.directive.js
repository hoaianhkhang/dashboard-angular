(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.details')
        .directive('userSwitches', userSwitches);

    /** @ngInject */
    function userSwitches() {
        return {
            restrict: 'E',
            controller: 'UserSwitchesCtrl',
            templateUrl: 'app/pages/users/userDetails/userSwitches/userSwitches.html'
        };
    }
})();