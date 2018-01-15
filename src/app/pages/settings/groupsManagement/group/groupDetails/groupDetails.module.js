(function () {
    'use strict';

    angular.module('BlurAdmin.pages.group.details', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('group.details', {
                url: '/details',
                views: {
                    'groupViewManagement': {
                        controller: 'GroupDetailsCtrl',
                        templateUrl: 'app/pages/settings/groupsManagement/group/groupDetails/groupDetails.html'
                    }
                },
                title: "Group settings"
            });
    }

})();
