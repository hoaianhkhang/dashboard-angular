(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.bitcoinTestnetService', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('bitcoinTestnetService', {
                url: '/services/bitcoin-testnet',
                abstract:true,
                title: 'Bitcoin testnet service'
            });
        $urlRouterProvider.when("/services/bitcoin-testnet", "/services/bitcoin/accounts");
    }

})();
