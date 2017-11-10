(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .directive('editUserCryptoAccounts', editUserCryptoAccounts);

    /** @ngInject */
    function editUserCryptoAccounts() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/users/user/userDetails/userCryptoAccounts/editUserCryptoAccounts/editUserCryptoAccounts.html'
        };
    }
})();
