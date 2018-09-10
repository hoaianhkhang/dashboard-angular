(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.notificationService.createNotificationServiceNotification')
        .directive('createNotificationServiceNotificationMenu', createNotificationServiceNotificationMenu);

    /** @ngInject */
    function createNotificationServiceNotificationMenu() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/notificationService/notificationServiceNotifications/' +
            'createNotificationServiceNotification/createNotificationServiceNotificationMenu/' +
            'createNotificationServiceNotificationMenu.html'
        };
    }
})();
