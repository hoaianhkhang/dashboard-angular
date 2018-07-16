(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.rewardsService', [
        'BlurAdmin.pages.services.rewardsService.rewardsServiceCampaigns',
        'BlurAdmin.pages.services.rewardsService.rewardsServiceLogs',
        'BlurAdmin.pages.services.rewardsService.rewardsServiceRequests'
    ])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('rewardsService', {
                url: '/services/rewards',
                abstract: true,
                template:'<div ui-view="rewardsServiceViews"></div>'
            });
        $urlRouterProvider.when("/services/rewards", "/services/rewards/campaigns");
    }

})();
