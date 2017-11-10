(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .directive('userAccounts', userAccounts);

    /** @ngInject */
    function userAccounts() {
        return {
            restrict: 'E',
            controller: 'UserAccountsCtrl',
            templateUrl: 'app/pages/users/user/userDetails/userAccounts/userAccounts.html'
        };
    }
})();
