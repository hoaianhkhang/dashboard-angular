(function () {
    'use strict';

    angular.module('BlurAdmin.pages.group.accountConfigurations', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('group.accountConfigurations', {
                url: '/account-configurations',
                views: {
                    'groupViewManagement': {
                        controller: 'GroupAccountConfigurationCtrl',
                        templateUrl: 'app/pages/settings/groupsManagement/group/groupAccountConfigurations/groupAccountConfigurations.html'
                    }
                },
                title: "Group account configurations"
            });
    }

})();
