(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarTestnetService.stellarTestnetServiceAccounts')
        .directive('stellarTestnetColdstorage', stellarTestnetColdstorage);

    /** @ngInject */
    function stellarTestnetColdstorage() {
        return {
            restrict: 'E',
            controller: 'StellarColdstorageCtrl',
            templateUrl: 'app/pages/services/stellarTestnetService/stellarTestnetServiceAccounts/stellarColdstorage/stellarColdstorage.html'
        };
    }
})();
