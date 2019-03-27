(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarTestnetService.stellarTestnetServiceConfig')
        .directive('stellarTestnetServiceSetupSubtypes', stellarTestnetServiceSetupSubtypes);

    /** @ngInject */
    function stellarTestnetServiceSetupSubtypes() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/services/stellarTestnetService/stellarTestnetServiceConfig/stellarTestnetServiceSetupSubtypes/stellarTestnetServiceSetupSubtypes.html'
        };
    }
})();
