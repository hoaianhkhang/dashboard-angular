(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.productsService')
        .directive('productsServiceNavigation', productsServiceNavigation);

    /** @ngInject */
    function productsServiceNavigation() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/productsService/productsServiceNavigation/productsServiceNavigation.html'
        };
    }
})();
