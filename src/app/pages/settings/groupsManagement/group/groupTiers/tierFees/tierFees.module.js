(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groupTiers.tierFees', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('groupTiers.tierFees', {
                url: '/fees',
                views:{
                    'groupTiersView':{
                      templateUrl: 'app/pages/settings/groupsManagement/group/groupTiers/tierFees/tierFees.html',
                      controller: "TierFeesCtrl"
                    }
                },
                title: 'Tier fees'
            });
    }

})();
