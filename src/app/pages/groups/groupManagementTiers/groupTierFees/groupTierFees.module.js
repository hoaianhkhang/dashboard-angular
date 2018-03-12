(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groups.groupManagementTiers.groupTierFees', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('groups.groupManagementTiers.groupTierFees', {
                url: '/fees',
                views:{
                    'groupTiersManagementView':{
                      templateUrl: 'app/pages/groups/groupManagementTiers/groupTierFees/groupTierFees.html',
                      controller: "GroupTierFeesCtrl"
                    }
                },
                title: 'Tier fees'
            });
    }

})();
