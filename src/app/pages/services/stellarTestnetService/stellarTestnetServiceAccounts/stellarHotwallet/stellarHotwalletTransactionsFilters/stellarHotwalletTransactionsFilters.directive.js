(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarTestnetService.stellarTestnetServiceAccounts')
        .directive('stellarHotwalletTransactionsFilters', stellarHotwalletTransactionsFilters);

    /** @ngInject */
    function stellarHotwalletTransactionsFilters() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/stellarTestnetService/stellarTestnetServiceAccounts/stellarHotwallet/stellarHotwalletTransactionsFilters/stellarHotwalletTransactionsFilters.html'
        };
    }
})();
