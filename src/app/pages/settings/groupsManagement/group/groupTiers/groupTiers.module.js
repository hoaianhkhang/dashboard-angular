(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groupTiers', [
        'BlurAdmin.pages.groupTiers.list',
        'BlurAdmin.pages.groupTiers.tierRequirements',
        'BlurAdmin.pages.groupTiers.tierLimits',
        'BlurAdmin.pages.groupTiers.tierFees'
    ])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('groupTiers', {
                url: '/settings/groups-management/:groupName/tiers',
                controller: 'GroupTiersCtrl',
                templateUrl: 'app/pages/settings/groupsManagement/group/groupTiers/groupTiers.html',
                title: "Group tiers"
            });
    }

})();
