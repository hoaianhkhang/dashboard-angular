(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarTestnetService.stellarTestnetServiceAccounts')
        .directive('stellarTestnetHotwalletTransactionsFilters', stellarTestnetHotwalletTransactionsFilters);

    /** @ngInject */
    function stellarTestnetHotwalletTransactionsFilters() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/stellarTestnetService/stellarTestnetServiceAccounts/stellarTestnetHotwallet/stellarTestnetHotwalletTransactionsFilters/stellarTestnetHotwalletTransactionsFilters.html'
        };
    }
})();
