(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.bitcoinService.bitcoinServiceAccounts')
        .directive('hotwalletTransactionsTable', hotwalletTransactionsTable);

    /** @ngInject */
    function hotwalletTransactionsTable() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/bitcoinService/bitcoinServiceAccounts/bitcoinHotwallet/hotwalletTransactionsTable/hotwalletTransactionsTable.html'
        };
    }
})();
