(function () {
    'use strict';

    angular.module('BlurAdmin.pages.transactions', [
            'BlurAdmin.pages.transactions.history',
            'BlurAdmin.pages.transactions.debit',
            'BlurAdmin.pages.transactions.credit',
            'BlurAdmin.pages.transactions.transfers',
            'BlurAdmin.pages.transactions.subtypes'
        ])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('transactions', {
                url: '/transactions',
                template : '<div ui-view="transactionsViews"></div>',
                title: 'Transactions',
                sidebarMeta: {
                    order: 100
                }
            });
    }

})();