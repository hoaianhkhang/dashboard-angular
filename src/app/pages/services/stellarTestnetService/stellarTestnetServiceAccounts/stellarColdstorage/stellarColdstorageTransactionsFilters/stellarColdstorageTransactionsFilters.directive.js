(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarTestnetService.stellarTestnetServiceAccounts')
        .directive('stellarColdstorageTransactionsFilters', stellarColdstorageTransactionsFilters);

    /** @ngInject */
    function stellarColdstorageTransactionsFilters() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/stellarTestnetService/stellarTestnetServiceAccounts/stellarColdstorage/stellarColdstorageTransactionsFilters/stellarColdstorageTransactionsFilters.html'
        };
    }
})();
