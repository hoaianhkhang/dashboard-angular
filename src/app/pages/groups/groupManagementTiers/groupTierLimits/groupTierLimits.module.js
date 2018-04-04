(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groups.groupManagementTiers.groupTierLimits', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('groups.groupManagementTiers.groupTierLimits', {
                url: '/limits',
                views:{
                    'groupTiersManagementView':{
                      templateUrl: 'app/pages/groups/groupManagementTiers/groupTierLimits/groupTierLimits.html',
                      controller: "GroupTierLimitsCtrl"
                    }
                },
                title: 'Tier limits'
            });
    }

})();
