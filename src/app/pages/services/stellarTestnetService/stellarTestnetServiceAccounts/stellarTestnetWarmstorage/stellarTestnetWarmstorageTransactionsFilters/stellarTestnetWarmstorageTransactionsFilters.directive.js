(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarTestnetService.stellarTestnetServiceAccounts')
        .directive('stellarTestnetWarmstorageTransactionsFilters', stellarTestnetWarmstorageTransactionsFilters);

    /** @ngInject */
    function stellarTestnetWarmstorageTransactionsFilters() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/stellarTestnetService/stellarTestnetServiceAccounts/stellarTestnetWarmstorage/stellarTestnetWarmstorageTransactionsFilters/stellarTestnetWarmstorageTransactionsFilters.html'
        };
    }
})();
