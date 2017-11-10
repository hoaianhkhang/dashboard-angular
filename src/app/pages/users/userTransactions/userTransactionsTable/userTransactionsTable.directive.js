(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.details')
        .directive('lastTransactionsTable', lastTransactionsTable);

    /** @ngInject */
    function lastTransactionsTable() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/users/userDetails/lastTransactions/lastTransactionsTable/lastTransactionsTable.html'
        };
    }
})();
