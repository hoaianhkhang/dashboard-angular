(function () {
    'use strict';

    angular.module('BlurAdmin.pages.group.accountConfiguration', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('group.accountConfiguration', {
                url: '/account-configurations/:accountConfigName/currencies',
                views: {
                    'groupViewManagement': {
                        controller: 'GroupAccountConfigurationCtrl',
                        templateUrl: 'app/pages/settings/groupsManagement/group/groupAccountConfigurations/groupAccountConfiguration/groupAccountConfiguration.html'
                    }
                }
            });
    }

})();
