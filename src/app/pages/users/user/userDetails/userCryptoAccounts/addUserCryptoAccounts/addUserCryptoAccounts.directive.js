(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .directive('addUserCryptoAccounts', addUserCryptoAccounts);

    /** @ngInject */
    function addUserCryptoAccounts() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/users/user/userDetails/userCryptoAccounts/addUserCryptoAccounts/addUserCryptoAccounts.html'
        };
    }
})();
