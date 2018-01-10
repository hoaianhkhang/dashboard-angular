(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groupTiers.tierSettings', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('groupTiers.tierSettings', {
                url: '/settings',
                views:{
                    'groupTiersView':{
                        templateUrl: 'app/pages/settings/groupsManagement/group/groupTiers/tierSettings/tierSettings.html',
                        controller: "TierSettingsCtrl"
                    }
                },
                title: 'Tier settings'
            });
    }

})();
