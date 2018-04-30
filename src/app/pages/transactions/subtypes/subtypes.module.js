(function () {
    'use strict';

    angular.module('BlurAdmin.pages.transactions.subtypes', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('transactions.subtypes', {
                url: '/subtypes',
                views: {
                  'transactionsViews': {
                    controller: 'SubtypesCtrl',
                    templateUrl: 'app/pages/transactions/subtypes/subtypes.html'
                  }
                },
                title: "Subtypes"
            });
    }

})();
