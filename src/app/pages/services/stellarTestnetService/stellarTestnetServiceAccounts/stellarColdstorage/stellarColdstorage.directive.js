(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarTestnetService.stellarTestnetServiceAccounts')
        .directive('stellarColdstorage', stellarColdstorage);

    /** @ngInject */
    function stellarColdstorage() {
        return {
            restrict: 'E',
            controller: 'StellarColdstorageCtrl',
            templateUrl: 'app/pages/services/stellarTestnetService/stellarTestnetServiceAccounts/stellarColdstorage/stellarColdstorage.html'
        };
    }
})();
