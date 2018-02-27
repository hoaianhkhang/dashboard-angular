(function () {
    'use strict';

    angular.module('BlurAdmin.pages.accountSettings.accountCurrencySettings', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('accountSettings.accountCurrencySettings', {
                url: '/settings',
                title: 'Account currency settings',
                views:{
                    'accountSettings':{
                        templateUrl: 'app/pages/users/user/userAccountsOnly/accountSettings/accountCurrencySettings/accountCurrencySettings.html',
                        controller: "AccountCurrencySettingsCtrl"
                    }
                }
            });
    }

})();