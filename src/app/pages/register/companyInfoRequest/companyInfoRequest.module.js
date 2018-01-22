(function () {
    'use strict';

    angular.module('BlurAdmin.pages.companyInfoRequest', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('companyInfoRequest', {
                url: '/company/info_request',
                views:{
                    'admin':{
                        templateUrl: 'app/pages/register/companyInfoRequest/companyInfoRequest.html',
                        controller: 'CompanyInfoRequestCtrl'
                    }
                }
            });
    }

})();
