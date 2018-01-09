(function () {
    'use strict';

    angular.module('BlurAdmin.pages.group.settings', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('group.settings', {
                url: '/settings',
                views: {
                    'groupViewManagement': {
                        controller: 'GroupSettingsCtrl',
                        templateUrl: 'app/pages/settings/groupsManagement/group/groupSettings/groupSettings.html'
                    }
                },
                title: "Settings"
            });
    }

})();
