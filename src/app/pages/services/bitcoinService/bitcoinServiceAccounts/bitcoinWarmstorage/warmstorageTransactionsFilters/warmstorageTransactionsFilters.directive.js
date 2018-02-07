(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.bitcoinService.bitcoinServiceAccounts')
        .directive('warmstorageTransactionsFilters', warmstorageTransactionsFilters);

    /** @ngInject */
    function warmstorageTransactionsFilters() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/bitcoinService/bitcoinServiceAccounts/bitcoinWarmstorage/warmstorageTransactionsFilters/warmstorageTransactionsFilters.html'
        };
    }
})();
