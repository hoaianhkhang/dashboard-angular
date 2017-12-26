(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.addUser', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('addUsers', {
                url: '/users/add',
                templateUrl: 'app/pages/users/addUser/addUser.html',
                controller: "AddUserCtrl"
            });
    }

})();