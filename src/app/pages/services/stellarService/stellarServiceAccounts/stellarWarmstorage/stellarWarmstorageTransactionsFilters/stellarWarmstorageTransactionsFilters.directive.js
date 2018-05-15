(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarService.stellarServiceAccounts')
        .directive('stellarWarmstorageTransactionsFilters', stellarWarmstorageTransactionsFilters);

    /** @ngInject */
    function stellarWarmstorageTransactionsFilters() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/stellarService/stellarServiceAccounts/stellarWarmstorage/stellarWarmstorageTransactionsFilters/stellarWarmstorageTransactionsFilters.html'
        };
    }
})();
