(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarService.stellarServiceAccounts')
        .directive('stellarColdstorageTransactionsFilters', stellarColdstorageTransactionsFilters);

    /** @ngInject */
    function stellarColdstorageTransactionsFilters() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/stellarService/stellarServiceAccounts/stellarColdstorage/stellarColdstorageTransactionsFilters/stellarColdstorageTransactionsFilters.html'
        };
    }
})();
