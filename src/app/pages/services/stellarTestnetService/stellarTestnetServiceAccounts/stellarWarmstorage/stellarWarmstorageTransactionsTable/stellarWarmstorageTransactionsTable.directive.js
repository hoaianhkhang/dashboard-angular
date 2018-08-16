(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarTestnetService.stellarTestnetServiceAccounts')
        .directive('stellarWarmstorageTransactionsTable', stellarWarmstorageTransactionsTable);

    /** @ngInject */
    function stellarWarmstorageTransactionsTable() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/stellarTestnetService/stellarTestnetServiceAccounts/stellarWarmstorage/stellarWarmstorageTransactionsTable/stellarWarmstorageTransactionsTable.html'
        };
    }
})();
