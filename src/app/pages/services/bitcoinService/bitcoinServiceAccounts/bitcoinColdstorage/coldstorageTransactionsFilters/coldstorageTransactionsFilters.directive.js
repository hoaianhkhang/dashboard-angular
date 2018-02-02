(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.bitcoinService.bitcoinServiceAccounts')
        .directive('coldstorageTransactionsFilters', coldstorageTransactionsFilters);

    /** @ngInject */
    function coldstorageTransactionsFilters() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/bitcoinService/bitcoinServiceAccounts/bitcoinColdstorage/coldstorageTransactionsFilters/coldstorageTransactionsFilters.html'
        };
    }
})();
