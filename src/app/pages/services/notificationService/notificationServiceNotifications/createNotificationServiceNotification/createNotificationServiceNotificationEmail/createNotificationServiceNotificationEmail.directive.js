(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.notificationService.createNotificationServiceNotification')
        .directive('createNotificationServiceNotificationEmail', createNotificationServiceNotificationEmail);

    /** @ngInject */
    function createNotificationServiceNotificationEmail() {
        return {
            restrict: 'E',
            controller: 'CreateNotificationServiceNotificationEmailCtrl',
            templateUrl: 'app/pages/services/notificationService/notificationServiceNotifications/' +
            'createNotificationServiceNotification/createNotificationServiceNotificationEmail/' +
            'createNotificationServiceNotificationEmail.html'
        };
    }
})();
