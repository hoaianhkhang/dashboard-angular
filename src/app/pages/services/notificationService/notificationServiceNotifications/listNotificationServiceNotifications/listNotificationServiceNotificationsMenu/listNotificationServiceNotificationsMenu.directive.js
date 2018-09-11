(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.notificationService.listNotificationServiceNotifications')
        .directive('listNotificationServiceNotificationsMenu', listNotificationServiceNotificationsMenu);

    /** @ngInject */
    function listNotificationServiceNotificationsMenu() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/notificationService/notificationServiceNotifications/' +
            'listNotificationServiceNotifications/listNotificationServiceNotificationsMenu/' +
            'listNotificationServiceNotificationsMenu.html'
        };
    }
})();
