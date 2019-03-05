(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.bitcoinTestnetService', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('bitcoinTestnetService', {
                // url: '/services/bitcoin-testnet',
                url: '/extensions/bitcoin-testnet',
                abstract:true,
                // title: 'Bitcoin testnet service'
                title: 'Bitcoin testnet extension'
            });
        // $urlRouterProvider.when("/services/bitcoin-testnet", "/services/bitcoin/accounts");
        $urlRouterProvider.when("/extensions/bitcoin-testnet", "/extensions/bitcoin/accounts");
    }

})();
