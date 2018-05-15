(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarService.stellarServiceAccounts')
        .directive('stellarColdstorageTransactionsTable', stellarColdstorageTransactionsTable);

    /** @ngInject */
    function stellarColdstorageTransactionsTable() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/stellarService/stellarServiceAccounts/stellarColdstorage/stellarColdstorageTransactionsTable/stellarColdstorageTransactionsTable.html'
        };
    }
})();
