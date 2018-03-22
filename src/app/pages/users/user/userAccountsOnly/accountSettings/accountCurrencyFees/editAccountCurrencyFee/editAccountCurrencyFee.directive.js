(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user.accountSettings.accountCurrencyFees')
        .directive('editAccountCurrencyFee', editAccountCurrencyFee);

    /** @ngInject */
    function editAccountCurrencyFee() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/users/user/userAccountsOnly/accountSettings/accountCurrencyFees/editAccountCurrencyFee/editAccountCurrencyFee.html'
        };
    }
})();
