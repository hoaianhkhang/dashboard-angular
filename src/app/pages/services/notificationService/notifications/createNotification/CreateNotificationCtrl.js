(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.notificationService.createNotification')
        .controller('CreateNotificationsCtrl', CreateNotificationsCtrl);

    /** @ngInject */
    function CreateNotificationsCtrl($scope,localStorageManagement,$location) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.baseUrl = localStorageManagement.getValue('SERVICEURL');
        $scope.createNotificationView = 'email';

        $scope.goToCreateNotificationView = function (path) {
            $scope.createNotificationView = path;
            $location.path('/services/notifications/create/' + $scope.createNotificationView);
        };
        $scope.goToCreateNotificationView('email');

    }
})();
