(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user', [
        'BlurAdmin.pages.users.user.details',
        'BlurAdmin.pages.users.user.transactions'
    ])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('user', {
                url: '/user/:uuid',
                templateUrl: 'app/pages/users/user/user.html',
                controller: "UserCtrl",
                title: 'User info'
            });
    }

})();