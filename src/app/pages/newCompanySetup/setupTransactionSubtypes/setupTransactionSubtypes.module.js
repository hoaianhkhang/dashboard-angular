(function () {
    'use strict';

    angular.module('BlurAdmin.pages.newCompanySetup.setupTransactionSubtypes',[])
        .config(routeConfig)

    /** @ngInject */

    function routeConfig ($stateProvider) {
        $stateProvider
            .state('newCompanySetup.setupTransactionSubtypes',{
                url:'/subtypes',
                views:{
                    'companySetupView': {
                        templateUrl: 'app/pages/newCompanySetup/setupTransactionSubtypes/setupTransactionSubtypes.html',
                        controller:'SetupTransactionSubtypesCtrl'
                    }
                }
            })
    }

})();