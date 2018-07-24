(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.ethereumService.ethereumServiceAccounts')
        .directive('ethereumColdstorageTransactionsTable', ethereumColdstorageTransactionsTable);

    /** @ngInject */
    function ethereumColdstorageTransactionsTable() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/ethereumService/ethereumServiceAccounts/ethereumColdstorage/coldstorageTransactionsTable/coldstorageTransactionsTable.html'
        };
    }
})();
