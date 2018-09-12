(function () {
    'use strict';

    angular.module('BlurAdmin.pages.accounts')
        .directive('accountsTable', accountsTable);

    /** @ngInject */
    function accountsTable() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/accounts/accountsTable/accountsTable.html'
        };
    }
})();