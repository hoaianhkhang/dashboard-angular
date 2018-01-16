(function () {
    'use strict';

    angular.module('BlurAdmin.pages.accountSettings', [
        'BlurAdmin.pages.accountSettings.accountCurrencyLimits',
        'BlurAdmin.pages.accountSettings.accountCurrencyFees',
        'BlurAdmin.pages.accountSettings.accountCurrencySettings'
    ])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('accountSettings', {
                url: '/user/:uuid/account/:reference/settings/:currencyCode',
                templateUrl: 'app/pages/users/user/userDetails/userAccounts/accountSettings/accountSettings.html',
                controller: "AccountSettingsCtrl",
                title: 'Account settings'
            });
    }

})();