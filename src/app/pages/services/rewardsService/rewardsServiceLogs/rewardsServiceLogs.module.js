(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.rewardsService.rewardsServiceLogs', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('rewardsService.rewardsServiceLogs', {
                url: '/logs',
                views: {
                    'rewardsServiceViews' : {
                        templateUrl:'app/pages/services/rewardsService/rewardsServiceLogs/rewardsServiceLogs.html',
                        controller: "RewardsServiceLogsCtrl"
                    }
                },
                title: 'Rewards logs'
            });
    }

})();
