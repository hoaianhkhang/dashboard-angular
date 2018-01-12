(function () {
    'use strict';

    angular.module('BlurAdmin.pages.newCompanySetup',[
        'BlurAdmin.pages.newCompanySetup.initialSetupScreen',
        'BlurAdmin.pages.newCompanySetup.setupUsers',
        'BlurAdmin.pages.newCompanySetup.setupAccounts'
    ])
        .config(routeConfig)

    /** @ngInject */

    function routeConfig ($stateProvider) {
        $stateProvider
            .state('newCompanySetup',{
                url:'/company/setup',
                views:{
                    'admin': {
                        templateUrl: 'app/pages/newCompanySetup/newCompanySetup.html',
                        controller:'NewCompanySetupCtrl'
                    }
                }
            })
    }

})();