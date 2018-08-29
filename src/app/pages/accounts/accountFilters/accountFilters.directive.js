(function () {
    'use strict';

    angular.module('BlurAdmin.pages.accounts')
        .directive('accountsFilters', accountsFilters);

    /** @ngInject */
    function accountsFilters() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/accounts/accountFilters/accountFilters.html'
        };
    }
})();