(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.details')
        .directive('editUserCryptoAccounts', editUserCryptoAccounts);

    /** @ngInject */
    function editUserCryptoAccounts() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/users/userDetails/userCryptoAccounts/editUserCryptoAccounts/editUserCryptoAccounts.html'
        };
    }
})();
