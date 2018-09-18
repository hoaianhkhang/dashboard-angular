(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.notificationService.editNotificationServiceNotification', [
        'BlurAdmin.pages.services.notificationService.editNotificationServiceNotification.email',
        'BlurAdmin.pages.services.notificationService.editNotificationServiceNotification.sms'
    ])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('notificationService.editNotificationServiceNotification', {
                url: '/:id/edit',
                views: {
                    'notificationServiceViews' : {
                        template: '<div ui-view="notificationServiceEditViews"></div>'
                    }
                },
                title: 'Notifications'
            });
    }

})();
