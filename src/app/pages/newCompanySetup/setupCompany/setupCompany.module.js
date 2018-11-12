(function () {
    'use strict';

    angular.module('BlurAdmin.pages.newCompanySetup.setupCompany',[])
        .config(routeConfig);

    /** @ngInject */

    function routeConfig ($stateProvider) {
        $stateProvider
            .state('newCompanySetup.setupCompany',{
                url:'/company-details',
                views:{
                    'companySetupView': {
                        templateUrl: 'app/pages/newCompanySetup/setupCompany/setupCompany.html',
                        controller:'SetupCompanyCtrl'
                    }
                }
            });
    }

})();