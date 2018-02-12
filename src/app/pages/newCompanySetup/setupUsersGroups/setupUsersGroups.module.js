(function () {
    'use strict';

    angular.module('BlurAdmin.pages.newCompanySetup.setupUsersGroups',[])
        .config(routeConfig)

    /** @ngInject */

    function routeConfig ($stateProvider) {
        $stateProvider
            .state('newCompanySetup.setupUsersGroups',{
                url:'/groups',
                views:{
                    'companySetupView': {
                        templateUrl: 'app/pages/newCompanySetup/setupUsersGroups/setupUsersGroups.html',
                        controller:'SetupUsersGroupsCtrl'
                    }
                }
            })
    }

})();