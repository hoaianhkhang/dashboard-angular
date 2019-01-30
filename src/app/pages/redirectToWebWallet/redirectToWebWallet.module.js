(function () {
    'use strict';

    angular.module('BlurAdmin.pages.redirectToWebWallet',[])
        .config(routeConfig);

    /** @ngInject */

    function routeConfig ($stateProvider) {
        $stateProvider
            .state('redirectToWebWallet',{
                fixedHref: 'https://wallet.rehive.com/',
                title: 'Go to web wallet',
                blank: true,
                sidebarMeta: {
                    order: 800
                }
            });
    }

})();