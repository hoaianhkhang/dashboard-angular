(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarTestnetService.stellarTestnetServiceAccounts')
        .directive('stellarWarmstorageTransactionsFilters', stellarWarmstorageTransactionsFilters);

    /** @ngInject */
    function stellarWarmstorageTransactionsFilters() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/stellarTestnetService/stellarTestnetServiceAccounts/stellarWarmstorage/stellarWarmstorageTransactionsFilters/stellarWarmstorageTransactionsFilters.html'
        };
    }
})();
