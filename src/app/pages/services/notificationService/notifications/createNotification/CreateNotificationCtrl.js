(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.notificationService.createNotification')
        .controller('CreateNotificationsCtrl', CreateNotificationsCtrl);

    /** @ngInject */
    function CreateNotificationsCtrl($scope,localStorageManagement,$location) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        // vm.baseUrl = localStorageManagement.getValue('SERVICEURL');
        vm.baseUrl = "https://notification.services.rehive.io/api/";
        var location = $location.path();
        var locationArray = location.split('/');
        $scope.locationIndicator = locationArray[(locationArray.length -1)];
        $scope.createNotificationView = $scope.locationIndicator;

        $scope.goToCreateNotificationView = function (path) {
            $scope.createNotificationView = path;
            // $location.path('/services/notifications/create/' + $scope.createNotificationView);
            $location.path('/extensions/notifications/create/' + $scope.createNotificationView);
        };
        $scope.goToCreateNotificationView($scope.locationIndicator);

    }
})();
