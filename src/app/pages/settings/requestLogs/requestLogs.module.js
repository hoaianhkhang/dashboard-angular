(function () {
    'use strict';

    angular.module('BlurAdmin.pages.settings.requestLogs', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('settings.requestLogs', {
                url: '/request-logs',
                views: {
                    'generalSettings': {
                        templateUrl: 'app/pages/settings/requestLogs/requestLogs.html',
                        controller: "RequestLogsCtrl"
                    }
                },
                title: "Request logs"
            });
    }

})();
