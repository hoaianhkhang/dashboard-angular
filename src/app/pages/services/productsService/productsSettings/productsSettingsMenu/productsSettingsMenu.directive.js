(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.productsService.productsSettings')
        .directive('productsSettingsMenu', productsSettingsMenu);

    /** @ngInject */
    function productsSettingsMenu() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/productsService/productsSettings/productsSettingsMenu/productsSettingsMenu.html'
        };
    }
})();
