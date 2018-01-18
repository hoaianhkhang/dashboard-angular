(function () {
    'use strict';

    angular.module('BlurAdmin.pages.buildAFintechApp', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('buildAFintechApp', {
                controller: function ($location) {
                    $location.path('/company/setup/initial');
                },
                title: 'Build a fintech app',
                sidebarMeta: {
                    order: 0
                }
            });
    }

})();
