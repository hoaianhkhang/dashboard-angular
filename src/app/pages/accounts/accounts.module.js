(function () {
    'use strict';

    angular.module('BlurAdmin.pages.accounts', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('accounts', {
                url: '/accounts',
                templateUrl: 'app/pages/accounts/accounts.html',
                controller: 'AccountsCtrl',
                title: 'Accounts',
                sidebarMeta: {
                    order: 200,
                    icon: 'sidebar-accounts-icon'
                }
            });
    }

})();
