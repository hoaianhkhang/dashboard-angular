(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groups.groupManagementTiers.groupTierSettings', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('groups.groupManagementTiers.groupTierSettings', {
                url: '/settings',
                views:{
                    'groupTiersManagementView':{
                        templateUrl: 'app/pages/groups/groupManagementTiers/groupTierSettings/groupTierSettings.html',
                        controller: "GroupTierSettingsCtrl"
                    }
                },
                title: 'Tier settings'
            });
    }

})();
