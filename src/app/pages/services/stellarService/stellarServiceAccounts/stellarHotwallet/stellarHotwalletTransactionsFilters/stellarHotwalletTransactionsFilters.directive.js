(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarService.stellarServiceAccounts')
        .directive('stellarHotwalletTransactionsFilters', stellarHotwalletTransactionsFilters);

    /** @ngInject */
    function stellarHotwalletTransactionsFilters() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/stellarService/stellarServiceAccounts/stellarHotwallet/stellarHotwalletTransactionsFilters/stellarHotwalletTransactionsFilters.html'
        };
    }
})();
