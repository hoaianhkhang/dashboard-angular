(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groupTiers.tierLimits', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('groupTiers.tierLimits', {
                url: '/limits',
                views:{
                    'groupTiersView':{
                      templateUrl: 'app/pages/settings/groupsManagement/group/groupTiers/tierLimits/tierLimits.html',
                      controller: "TierLimitsCtrl"
                    }
                },
                title: 'Tier limits'
            });
    }

})();
