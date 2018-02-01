(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.bitcoinService.bitcoinServiceAccounts')
        .directive('hotwalletTransactionsFilters', hotwalletTransactionsFilters);

    /** @ngInject */
    function hotwalletTransactionsFilters() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/bitcoinService/bitcoinServiceAccounts/bitcoinHotwallet/hotwalletTransactionsFilters/hotwalletTransactionsFilters.html'
        };
    }
})();
