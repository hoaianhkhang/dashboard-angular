(function () {
    'use strict';

    angular.module('BlurAdmin.pages.newCompanySetup.initialSetupScreen',[])
        .config(routeConfig)

    /** @ngInject */

    function routeConfig ($stateProvider) {
        $stateProvider
            .state('newCompanySetup.initialSetupScreen',{
                url:'/initial',
                views:{
                    'companySetupView': {
                        templateUrl: 'app/pages/newCompanySetup/initialSetupScreen/initialSetupScreen.html',
                        controller:'InitialSetupScreenCtrl'
                    }
                }
            })
    }

})();