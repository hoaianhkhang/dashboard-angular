(function () {
    'use strict';

    angular.module('BlurAdmin.pages.newCompanySetup.setupAccounts',[])
        .config(routeConfig)

    /** @ngInject */

    function routeConfig ($stateProvider) {
        $stateProvider
            .state('newCompanySetup.setupAccounts',{
                url:'/accounts',
                views:{
                    'companySetupView': {
                        templateUrl: 'app/pages/newCompanySetup/setupAccounts/setupAccounts.html',
                        controller:'SetupAccountsCtrl'
                    }
                }
            })
    }

})();