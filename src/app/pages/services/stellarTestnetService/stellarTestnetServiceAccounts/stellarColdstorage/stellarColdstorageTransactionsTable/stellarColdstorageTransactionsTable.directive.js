(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarTestnetService.stellarTestnetServiceAccounts')
        .directive('stellarColdstorageTransactionsTable', stellarColdstorageTransactionsTable);

    /** @ngInject */
    function stellarColdstorageTransactionsTable() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/stellarTestnetService/stellarTestnetServiceAccounts/stellarColdstorage/stellarColdstorageTransactionsTable/stellarColdstorageTransactionsTable.html'
        };
    }
})();
