(function () {
    'use strict';

    angular.module('BlurAdmin.pages.settings.requestLog', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('settings.requestLog', {
                url: '/request-log/:logId/',
                views: {
                    'generalSettings': {
                        templateUrl: 'app/pages/settings/requestLogs/requestLog/requestLog.html',
                        controller: "RequestLogCtrl"
                    }
                },
                title: "Request log"
            });
    }

})();



