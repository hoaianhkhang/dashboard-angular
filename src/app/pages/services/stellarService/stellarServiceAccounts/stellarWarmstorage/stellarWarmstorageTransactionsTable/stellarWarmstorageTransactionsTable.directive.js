(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarService.stellarServiceAccounts')
        .directive('stellarWarmstorageTransactionsTable', stellarWarmstorageTransactionsTable);

    /** @ngInject */
    function stellarWarmstorageTransactionsTable() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/stellarService/stellarServiceAccounts/stellarWarmstorage/stellarWarmstorageTransactionsTable/stellarWarmstorageTransactionsTable.html'
        };
    }
})();
