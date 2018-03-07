(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groupAccountConfigurations', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('groupAccountConfigurations', {
                url: '/groups/:groupName/account-configurations',
                controller: 'GroupAccountConfigurationsCtrl',
                templateUrl: 'app/pages/groups/groupAccountConfigurations/groupAccountConfigurations.html',
                title: "Group Users"
            });
    }

})();
