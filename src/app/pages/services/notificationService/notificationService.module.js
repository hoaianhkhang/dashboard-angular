(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.notificationService', [
        'BlurAdmin.pages.services.notificationService.notificationServiceSettings',
        'BlurAdmin.pages.services.notificationService.notificationServiceLogs',
        'BlurAdmin.pages.services.notificationService.listNotificationServiceNotifications',
        'BlurAdmin.pages.services.notificationService.createNotificationServiceNotification',
        'BlurAdmin.pages.services.notificationService.editNotificationServiceNotification'
    ])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('notificationService', {
                url: '/services/notifications',
                abstract: true,
                template:'<div ui-view="notificationServiceViews"></div>'
            });
            $urlRouterProvider.when("/services/notifications", "/services/notifications/list");
    }

})();
