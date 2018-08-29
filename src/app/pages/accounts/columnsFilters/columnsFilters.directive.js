(function () {
    'use strict';

    angular.module('BlurAdmin.pages.accounts')
        .directive('columnsFilters', columnsFilters);

    /** @ngInject */
    function columnsFilters() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/accounts/columnsFilters/columnsFilters.html'
        };
    }
})();