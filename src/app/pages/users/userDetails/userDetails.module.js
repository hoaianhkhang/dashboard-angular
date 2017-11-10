(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.details', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('userDetails', {
                url: '/user/:uuid/details',
                templateUrl: 'app/pages/users/userDetails/userDetails.html',
                controller: "UserDetailsCtrl",
                title: 'User info'
            });
    }

})();