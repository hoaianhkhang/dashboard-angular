(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.bitcoinService.bitcoinServiceAccounts')
        .directive('coldstorageTransactionsTable', coldstorageTransactionsTable);

    /** @ngInject */
    function coldstorageTransactionsTable() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/bitcoinService/bitcoinServiceAccounts/bitcoinColdstorage/coldstorageTransactionsTable/coldstorageTransactionsTable.html'
        };
    }
})();
