(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.notificationService.listNotifications')
        .directive('listNotificationsMenu', listNotificationsMenu);

    /** @ngInject */
    function listNotificationsMenu() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/notificationService/notifications/' +
            'listNotifications/listNotificationsMenu/' +
            'listNotificationsMenu.html'
        };
    }
})();
