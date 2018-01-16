(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groupTiers.tierRequirements', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('groupTiers.tierRequirements', {
                url: '/requirements',
                views:{
                    'groupTiersView':{
                      templateUrl: 'app/pages/settings/groupsManagement/group/groupTiers/tierRequirements/tierRequirements.html',
                      controller: "TierRequirementsCtrl"
                    }
                },
                title: 'Tier requirements'
            });
    }

})();
