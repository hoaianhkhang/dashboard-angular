(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.ethereumService.ethereumServiceAccounts')
        .directive('ethereumColdstorageTransactionsFilters', ethereumColdstorageTransactionsFilters);

    /** @ngInject */
    function ethereumColdstorageTransactionsFilters() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/ethereumService/ethereumServiceAccounts/ethereumColdstorage/coldstorageTransactionsFilters/coldstorageTransactionsFilters.html'
        };
    }
})();
