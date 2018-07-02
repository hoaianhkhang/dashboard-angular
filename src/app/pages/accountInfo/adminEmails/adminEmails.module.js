(function () {
    'use strict';

    angular.module('BlurAdmin.pages.adminEmails', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('adminEmails', {
                url: '/admin/emails',
                templateUrl: 'app/pages/accountInfo/adminEmails/adminEmails.html',
                controller: "AdminEmailsCtrl",
                title: "Admin emails"
            });
    }

})();
