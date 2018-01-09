(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groupTiers.list', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('groupTiers.list', {
                url: '/list',
                views:{
                    'groupTiersView':{
                      templateUrl: 'app/pages/settings/groupsManagement/group/groupTiers/tiers/tiers.html',
                      controller: "TiersCtrl"
                    }
                },
                title: 'Group tiers'
            });
    }

})();
