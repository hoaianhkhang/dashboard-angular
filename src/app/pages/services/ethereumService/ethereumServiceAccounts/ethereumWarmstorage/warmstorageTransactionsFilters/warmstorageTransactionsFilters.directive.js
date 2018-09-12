(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.ethereumService.ethereumServiceAccounts')
        .directive('ethereumWarmstorageTransactionsFilters', ethereumWarmstorageTransactionsFilters);

    /** @ngInject */
    function ethereumWarmstorageTransactionsFilters() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/ethereumService/ethereumServiceAccounts/ethereumWarmstorage/warmstorageTransactionsFilters/warmstorageTransactionsFilters.html'
        };
    }
})();
