(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.ethereumService.ethereumServiceAccounts')
        .directive('ethereumHotwalletTransactionsTable', ethereumHotwalletTransactionsTable);

    /** @ngInject */
    function ethereumHotwalletTransactionsTable() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/ethereumService/ethereumServiceAccounts/ethereumHotwallet/hotwalletTransactionsTable/hotwalletTransactionsTable.html'
        };
    }
})();
