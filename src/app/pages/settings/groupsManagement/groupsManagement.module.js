(function () {
    'use strict';

    angular.module('BlurAdmin.pages.settings.groupsManagement', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('settings.groupsManagement', {
                url: '/groups-management',
                views: {
                  'generalSettings': {
                    controller: 'GroupsManagementCtrl',
                    templateUrl: 'app/pages/settings/groupsManagement/groupsManagement.html'
                  }
                },
                title: "Groups management"
            });
    }

})();
