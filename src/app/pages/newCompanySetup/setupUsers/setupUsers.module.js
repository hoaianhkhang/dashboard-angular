(function () {
    'use strict';

    angular.module('BlurAdmin.pages.newCompanySetup.setupUsers',[])
        .config(routeConfig)

    /** @ngInject */

    function routeConfig ($stateProvider) {
        $stateProvider
            .state('newCompanySetup.setupUsers',{
                url:'/users',
                views:{
                    'companySetupView': {
                        templateUrl: 'app/pages/newCompanySetup/setupUsers/setupUsers.html',
                        controller:'SetupUsersCtrl'
                    }
                }
            })
    }

})();