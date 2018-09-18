(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.notificationService.editNotificationServiceNotification.sms', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('notificationService.editNotificationServiceNotification.sms', {
                url: '/sms',
                views: {
                    'notificationServiceEditViews' : {
                        templateUrl:'app/pages/services/notificationService/' +
                        'notificationServiceNotifications/editNotificationServiceNotification/' +
                        'editNotificationServiceNotificationSms/editNotificationServiceNotificationSms.html',
                        controller: "EditNotificationServiceNotificationSmsCtrl"
                    }
                },
                title: 'Notifications'
            });
    }

})();
