(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarTestnetService.stellarTestnetServiceAccounts')
        .directive('stellarTestnetHotwallet', stellarTestnetHotwallet);

    /** @ngInject */
    function stellarTestnetHotwallet() {
        return {
            restrict: 'E',
            controller: 'StellarHotwalletCtrl',
            templateUrl: 'app/pages/services/stellarTestnetService/stellarTestnetServiceAccounts/stellarHotwallet/stellarHotwallet.html'
        };
    }
})();
