(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.notificationService.createNotificationServiceNotification.email', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('notificationService.createNotificationServiceNotification.email', {
                url: '/email',
                views: {
                    'createNotificationViews': {
                        controller: 'CreateNotificationServiceNotificationEmailCtrl',
                        templateUrl: 'app/pages/services/notificationService/notificationServiceNotifications/' +
                        'createNotificationServiceNotification/createNotificationServiceNotificationEmail/' +
                        'createNotificationServiceNotificationEmail.html'
                    }
                },
                title: "Create email notification"
            });
    }

})();
