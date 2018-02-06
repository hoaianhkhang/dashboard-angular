(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.bitcoinService.bitcoinServiceAccounts')
        .directive('warmstorageTransactionsTable', warmstorageTransactionsTable);

    /** @ngInject */
    function warmstorageTransactionsTable() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/bitcoinService/bitcoinServiceAccounts/bitcoinColdstorage/warmstorageTransactionsTable/warmstorageTransactionsTable.html'
        };
    }
})();
