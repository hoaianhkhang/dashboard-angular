(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.notificationService.createNotificationServiceNotification')
        .directive('createNotificationServiceNotificationSms', createNotificationServiceNotificationSms);

    /** @ngInject */
    function createNotificationServiceNotificationSms() {
        return {
            restrict: 'E',
            controller: 'CreateNotificationServiceNotificationSmsCtrl',
            templateUrl: 'app/pages/services/notificationService/notificationServiceNotifications/' +
            'createNotificationServiceNotification/createNotificationServiceNotificationSms/' +
            'createNotificationServiceNotificationSms.html'
        };
    }
})();
