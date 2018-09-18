(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.notificationService.createNotificationServiceNotification')
        .controller('CreateNotificationServiceNotificationsCtrl', CreateNotificationServiceNotificationsCtrl);

    /** @ngInject */
    function CreateNotificationServiceNotificationsCtrl($scope,localStorageManagement) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.baseUrl = localStorageManagement.getValue('SERVICEURL');
        $scope.createNotificationView = 'sms';

        $scope.goToCreateNotificationView = function (path) {
            $scope.createNotificationView = path;
        };

    }
})();
