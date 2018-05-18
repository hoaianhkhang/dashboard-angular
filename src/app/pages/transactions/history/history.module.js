(function () {
    'use strict';

    angular.module('BlurAdmin.pages.transactions.history', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('transactions.history', {
                url: '/history',
                views: {
                    'transactionsViews': {
                        templateUrl: 'app/pages/transactions/history/history.html',
                        controller: "HistoryCtrl"
                    }
                },
                params: {
                    identifier: null,
                    transactionId: null,
                    currencyCode: null
                },
                title: 'History'
            });
    }

})();