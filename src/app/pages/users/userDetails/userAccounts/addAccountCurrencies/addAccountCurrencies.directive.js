(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.details')
        .directive('addAccountCurrencies', addAccountCurrencies);

    /** @ngInject */
    function addAccountCurrencies() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/users/userDetails/userAccounts/addAccountCurrencies/addAccountCurrencies.html'
        };
    }
})();
