(function () {
    'use strict';

    angular.module('BlurAdmin.pages.newCompanySetup',[
        'BlurAdmin.pages.newCompanySetup.setupCompany',
        'BlurAdmin.pages.newCompanySetup.setupUsersGroups',
        'BlurAdmin.pages.newCompanySetup.setupCurrencies',
        'BlurAdmin.pages.newCompanySetup.setupAccounts',
        'BlurAdmin.pages.newCompanySetup.setupTransactionSubtypes'
    ])
        .config(routeConfig);

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
            });
    }

})();