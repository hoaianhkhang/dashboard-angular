(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarTestnetService.stellarTestnetServiceAccounts')
        .directive('stellarTestnetWarmstorageTransactionsTable', stellarTestnetWarmstorageTransactionsTable);

    /** @ngInject */
    function stellarTestnetWarmstorageTransactionsTable() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/stellarTestnetService/stellarTestnetServiceAccounts/stellarTestnetWarmstorage/stellarTestnetWarmstorageTransactionsTable/stellarTestnetWarmstorageTransactionsTable.html'
        };
    }
})();
