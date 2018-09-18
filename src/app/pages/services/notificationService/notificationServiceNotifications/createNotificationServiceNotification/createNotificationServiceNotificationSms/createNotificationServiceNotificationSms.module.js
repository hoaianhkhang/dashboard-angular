(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.notificationService.createNotificationServiceNotification.sms', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('notificationService.createNotificationServiceNotification.sms', {
                url: '/sms',
                views: {
                    'createNotificationViews': {
                        controller: 'CreateNotificationServiceNotificationSmsCtrl',
                        templateUrl: 'app/pages/services/notificationService/notificationServiceNotifications/' +
                        'createNotificationServiceNotification/createNotificationServiceNotificationSms/' +
                        'createNotificationServiceNotificationSms.html'
                    }
                },
                title: "Create sms notification"
            });
    }

})();
