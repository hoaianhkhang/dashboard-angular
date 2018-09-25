(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.notificationService.listNotificationServiceNotifications')
        .directive('listNotificationFilters', listNotificationFilters);

    /** @ngInject */
    function listNotificationFilters() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/services/notificationService/notificationServiceNotifications/' +
            'listNotificationServiceNotifications/listNotificationFilters/listNotificationFilters.html'
        };
    }
})();