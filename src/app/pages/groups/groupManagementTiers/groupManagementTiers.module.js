(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groups.groupManagementTiers', [
        'BlurAdmin.pages.groups.groupManagementTiers.list',
        'BlurAdmin.pages.groups.groupManagementTiers.groupTierSettings'
    ])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('groups.groupManagementTiers', {
                url: '/:groupName/tiers',
                controller: 'GroupManagementTiersCtrl',
                templateUrl: 'app/pages/groups/groupManagementTiers/groupManagementTiers.html',
                title: "Tiers"
            });
    }

})();
