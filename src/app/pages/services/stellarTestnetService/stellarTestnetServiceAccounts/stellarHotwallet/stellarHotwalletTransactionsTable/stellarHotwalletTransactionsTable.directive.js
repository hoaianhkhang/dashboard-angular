(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarTestnetService.stellarTestnetServiceAccounts')
        .directive('stellarHotwalletTransactionsTable',stellarHotwalletTransactionsTable);

    /** @ngInject */
    function stellarHotwalletTransactionsTable() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/stellarTestnetService/stellarTestnetServiceAccounts/stellarHotwallet/stellarHotwalletTransactionsTable/stellarHotwalletTransactionsTable.html'
        };
    }
})();
