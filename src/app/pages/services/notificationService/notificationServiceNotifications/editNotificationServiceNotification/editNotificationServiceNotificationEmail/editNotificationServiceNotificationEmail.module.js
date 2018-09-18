(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.notificationService.editNotificationServiceNotification.email', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('notificationService.editNotificationServiceNotification.email', {
                url: '/email',
                views: {
                    'notificationServiceEditViews' : {
                        templateUrl:'app/pages/services/notificationService/' +
                        'notificationServiceNotifications/editNotificationServiceNotification/' +
                        'editNotificationServiceNotificationEmail/editNotificationServiceNotificationEmail.html',
                        controller: "EditNotificationServiceNotificationEmailCtrl"
                    }
                },
                title: 'Notifications'
            });
    }

})();
