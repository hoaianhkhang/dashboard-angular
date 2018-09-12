(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarTestnetService.stellarTestnetServiceAccounts')
        .directive('stellarTestnetHotwalletTransactionsTable',stellarTestnetHotwalletTransactionsTable);

    /** @ngInject */
    function stellarTestnetHotwalletTransactionsTable() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/stellarTestnetService/stellarTestnetServiceAccounts/stellarTestnetHotwallet/stellarTestnetHotwalletTransactionsTable/stellarTestnetHotwalletTransactionsTable.html'
        };
    }
})();
