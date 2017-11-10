(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.transactions', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('userTransactions', {
                url: '/user/:uuid/transactions',
                templateUrl: 'app/pages/users/userTransactions/userTransactions.html',
                controller: "UserTransactionsCtrl",
                title: 'User transactions'
            });
    }

})();