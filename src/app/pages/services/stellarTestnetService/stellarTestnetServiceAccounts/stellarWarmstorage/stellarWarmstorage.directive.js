(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarTestnetService.stellarTestnetServiceAccounts')
        .directive('stellarWarmstorage', stellarWarmstorage);

    /** @ngInject */
    function stellarWarmstorage() {
        return {
            restrict: 'E',
            controller: 'StellarWarmstorageCtrl',
            templateUrl: 'app/pages/services/stellarTestnetService/stellarTestnetServiceAccounts/stellarWarmstorage/stellarWarmstorage.html'
        };
    }
})();
