(function () {
    'use strict';

    angular.module('BlurAdmin.pages.accountSettings.accountCurrencySwitches')
        .directive('editAccountCurrencySwitch', editAccountCurrencySwitch);

    /** @ngInject */
    function editAccountCurrencySwitch() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/users/user/userDetails/userAccounts/accountSettings/accountCurrencySwitches/editAccountCurrencySwitch/editAccountCurrencySwitch.html'
        };
    }
})();
