(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.notificationService.createNotificationServiceNotification')
        .controller('CreateNotificationServiceNotificationsCtrl', CreateNotificationServiceNotificationsCtrl);

    /** @ngInject */
    function CreateNotificationServiceNotificationsCtrl($scope,$http,localStorageManagement,$location,errorHandler,toastr) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.baseUrl = localStorageManagement.getValue('SERVICEURL');
        $scope.createNotificationView = 'email';

        $scope.goToCreateNotificationView = function (path) {
            $scope.createNotificationView = path;
        };

    }
})();
