(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.details')
        .directive('userCryptoAccounts', userCryptoAccounts);

    /** @ngInject */
    function userCryptoAccounts() {
        return {
            restrict: 'E',
            controller: 'UserCryptoAccountsCtrl',
            templateUrl: 'app/pages/users/userDetails/userCryptoAccounts/userCryptoAccounts.html'
        };
    }
})();
