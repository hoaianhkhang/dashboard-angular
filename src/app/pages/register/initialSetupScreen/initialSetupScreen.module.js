(function () {
    'use strict';

    angular.module('BlurAdmin.pages.initialSetupScreen',[])
        .config(routeConfig)

    /** @ngInject */

    function routeConfig ($stateProvider) {
        $stateProvider
            .state('initialSetupScreen',{
                url:'/company/setup/initial',
                views:{
                    'admin': {
                        templateUrl: 'app/pages/register/initialSetupScreen/initialSetupScreen.html',
                        controller:'InitialSetupScreenCtrl'
                    }
                },
                title: 'Build a fintech app',
                sidebarMeta: {
                    order: 700
                }
            });
    }

})();