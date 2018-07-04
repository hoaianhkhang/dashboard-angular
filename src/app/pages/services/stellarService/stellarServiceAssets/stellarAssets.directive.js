(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarService.stellarServiceAssets')
        .directive('stellarassets', stellarassets);

    /** @ngInject */
    function stellarassets() {
        return {
            restrict: 'E',
            controller: 'StellarAssetsCtrl',
            templateUrl: 'app/pages/services/stellarService/stellarServiceAssets/stellarAssets.html'
        };
    }
})();
