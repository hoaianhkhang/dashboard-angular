(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarTestnetService.stellarTestnetServiceAccounts')
        .directive('stellarTestnetColdstorageTransactionsTable', stellarTestnetColdstorageTransactionsTable);

    /** @ngInject */
    function stellarTestnetColdstorageTransactionsTable() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/stellarTestnetService/stellarTestnetServiceAccounts/stellarTestnetColdstorage/stellarTestnetColdstorageTransactionsTable/stellarTestnetColdstorageTransactionsTable.html'
        };
    }
})();
