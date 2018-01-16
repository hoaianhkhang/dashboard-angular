(function () {
    'use strict';

    angular.module('BlurAdmin.pages.welcomeToRehive', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('welcomeToRehive', {
                url: '/welcome_rehive',
                views:{
                    'admin':{
                        templateUrl: 'app/pages/register/welcomeToRehive/welcomeToRehive.html',
                        controller: 'WelcomeToRehiveCtrl'
                    }
                }
            });
    }

})();
