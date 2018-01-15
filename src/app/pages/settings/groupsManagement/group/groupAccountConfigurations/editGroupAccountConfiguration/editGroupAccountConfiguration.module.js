(function () {
    'use strict';

    angular.module('BlurAdmin.pages.group.editAccountConfigurations', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('group.editAccountConfigurations', {
                url: '/account-configurations/:accountConfigName/edit',
                views: {
                    'groupViewManagement': {
                        controller: 'EditGroupAccountConfigurationCtrl',
                        templateUrl: 'app/pages/settings/groupsManagement/group/groupAccountConfigurations/editGroupAccountConfiguration/editGroupAccountConfiguration.html'
                    }
                },
                title: "Group account configuration"
            });
    }

})();
