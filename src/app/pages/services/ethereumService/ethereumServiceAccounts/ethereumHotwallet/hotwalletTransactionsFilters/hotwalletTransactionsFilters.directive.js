(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.ethereumService.ethereumServiceAccounts')
        .directive('ethereumHotwalletTransactionsFilters', ethereumHotwalletTransactionsFilters);

    /** @ngInject */
    function ethereumHotwalletTransactionsFilters() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/ethereumService/ethereumServiceAccounts/ethereumHotwallet/hotwalletTransactionsFilters/hotwalletTransactionsFilters.html'
        };
    }
})();
