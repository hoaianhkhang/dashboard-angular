(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.rewardsService', [
        'BlurAdmin.pages.services.rewardsService.rewardsServiceCampaigns',
        'BlurAdmin.pages.services.rewardsService.createRewardsServiceCampaign',
        'BlurAdmin.pages.services.rewardsService.editRewardsServiceCampaign',
        'BlurAdmin.pages.services.rewardsService.rewardsServiceRewards'
    ])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('rewardsService', {
                url: '/services/rewards',
                abstract: true,
                templateUrl:'app/pages/services/rewardsService/rewardsService.html',
                controller: "RewardsServiceCtrl"
            });
        $urlRouterProvider.when("/services/rewards", "/services/rewards/campaigns");
    }

})();
