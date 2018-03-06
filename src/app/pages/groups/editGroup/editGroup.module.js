(function () {
    'use strict';

    angular.module('BlurAdmin.pages.editGroup', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('editGroup', {
                url: '/groups/:groupName/details',
                controller: 'EditGroupCtrl',
                templateUrl: 'app/pages/groups/editGroup/editGroup.html',
                title: "Groups"
            });
    }

})();
