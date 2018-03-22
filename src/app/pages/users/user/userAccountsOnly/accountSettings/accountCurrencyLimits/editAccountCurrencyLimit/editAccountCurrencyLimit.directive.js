(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user.accountSettings.accountCurrencyLimits')
        .directive('editAccountCurrencyLimit', editAccountCurrencyLimit);

    /** @ngInject */
    function editAccountCurrencyLimit() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/users/user/userAccountsOnly/accountSettings/accountCurrencyLimits/editAccountCurrencyLimit/editAccountCurrencyLimit.html'
        };
    }
})();
