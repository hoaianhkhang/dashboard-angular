(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.rewardsService.rewardsServiceRequests', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('rewardsService.rewardsServiceRequests', {
                url: '/requests',
                views: {
                    'rewardsServiceViews' : {
                        templateUrl:'app/pages/services/rewardsService/rewardsServiceRequests/rewardsServiceRequests.html',
                        controller: "RewardsServiceRequestsCtrl"
                    }
                },
                title: 'Rewards requests'
            });
    }

})();
