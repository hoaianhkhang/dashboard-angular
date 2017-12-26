(function () {
    'use strict';

    angular.module('BlurAdmin.pages.currencies')
        .directive('currenciesFilter', currenciesFilter);

    /** @ngInject */
    function currenciesFilter() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/currencies/currenciesFilter/currenciesFilter.html'
        };
    }
})();