(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarTestnetService.stellarTestnetServiceAccounts')
        .directive('stellarTestnetColdstorageTransactionsFilters', stellarTestnetColdstorageTransactionsFilters);

    /** @ngInject */
    function stellarTestnetColdstorageTransactionsFilters() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/stellarTestnetService/stellarTestnetServiceAccounts/stellarTestnetColdstorage/stellarTestnetColdstorageTransactionsFilters/stellarTestnetColdstorageTransactionsFilters.html'
        };
    }
})();
