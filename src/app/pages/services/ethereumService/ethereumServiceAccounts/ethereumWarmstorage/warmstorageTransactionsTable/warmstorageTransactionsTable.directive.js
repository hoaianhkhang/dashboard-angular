(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.ethereumService.ethereumServiceAccounts')
        .directive('ethereumWarmstorageTransactionsTable', ethereumWarmstorageTransactionsTable);

    /** @ngInject */
    function ethereumWarmstorageTransactionsTable() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/ethereumService/ethereumServiceAccounts/ethereumWarmstorage/warmstorageTransactionsTable/warmstorageTransactionsTable.html'
        };
    }
})();
