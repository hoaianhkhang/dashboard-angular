(function () {
    'use strict';

    angular.module('BlurAdmin.pages.getStarted')
        .directive('getStartedWalletOptions', getStartedWalletOptions);

    /** @ngInject */
    function getStartedWalletOptions() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/getStarted/getStartedWalletOptions/getStartedWalletOptions.html'
        };
    }
})();
