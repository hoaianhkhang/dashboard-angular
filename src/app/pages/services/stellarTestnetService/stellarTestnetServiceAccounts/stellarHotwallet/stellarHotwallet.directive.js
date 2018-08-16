(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarTestnetService.stellarTestnetServiceAccounts')
        .directive('stellarHotwallet', stellarHotwallet);

    /** @ngInject */
    function stellarHotwallet() {
        return {
            restrict: 'E',
            controller: 'StellarHotwalletCtrl',
            templateUrl: 'app/pages/services/stellarTestnetService/stellarTestnetServiceAccounts/stellarHotwallet/stellarHotwallet.html'
        };
    }
})();
