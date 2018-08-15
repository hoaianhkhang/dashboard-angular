(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarTestnetService', [
        // "BlurAdmin.pages.services.stellarService.stellarServiceTransactions",
        // "BlurAdmin.pages.services.stellarService.stellarServiceUsers",
        "BlurAdmin.pages.services.stellarTestnetService.stellarTestnetServiceSetup",
        "BlurAdmin.pages.services.stellarTestnetService.stellarTestnetServiceConfig",
        // "BlurAdmin.pages.services.stellarService.stellarServiceAccounts",
        // "BlurAdmin.pages.services.stellarService.stellarServiceAssets"
    ])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('stellarTestnetService', {
                url: '/services/stellar-testnet',
                abstract:true,
                // templateUrl: 'app/pages/services/stellarService/stellarService.html',
                // controller: "StellarServiceCtrl",
                title: 'Stellar service'
            });
        $urlRouterProvider.when("/services/stellar-testnet", "/services/stellar-testnet/setup");
    }

})();
