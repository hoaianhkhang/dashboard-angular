(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarService.stellarServiceAccounts')
        .directive('stellarHotwalletTransactionsTable',stellarHotwalletTransactionsTable);

    /** @ngInject */
    function stellarHotwalletTransactionsTable() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/stellarService/stellarServiceAccounts/stellarHotwallet/stellarHotwalletTransactionsTable/stellarHotwalletTransactionsTable.html'
        };
    }
})();
