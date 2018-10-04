(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.notificationService.createNotification')
        .directive('createNotificationMenu', createNotificationMenu);

    /** @ngInject */
    function createNotificationMenu() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/notificationService/notifications/' +
            'createNotification/createNotificationMenu/' +
            'createNotificationMenu.html'
        };
    }
})();
