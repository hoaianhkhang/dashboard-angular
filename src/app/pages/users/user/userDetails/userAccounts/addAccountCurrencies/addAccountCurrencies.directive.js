(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .directive('addAccountCurrencies', addAccountCurrencies);

    /** @ngInject */
    function addAccountCurrencies() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/users/user/userDetails/userAccounts/addAccountCurrencies/addAccountCurrencies.html'
        };
    }
})();
