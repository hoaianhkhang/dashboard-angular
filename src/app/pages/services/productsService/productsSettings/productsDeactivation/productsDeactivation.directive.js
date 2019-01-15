(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.productsService.productsSettings')
        .directive('productsDeactivation', productsDeactivation);

    /** @ngInject */
    function productsDeactivation() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/productsService/productsSettings/productsDeactivation/productsDeactivation.html'
        };
    }
})();
