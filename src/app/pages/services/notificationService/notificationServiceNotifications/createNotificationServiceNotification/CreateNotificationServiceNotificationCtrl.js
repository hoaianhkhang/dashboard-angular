(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.notificationService.createNotificationServiceNotification')
        .controller('CreateNotificationServiceNotificationsCtrl', CreateNotificationServiceNotificationsCtrl);

    /** @ngInject */
    function CreateNotificationServiceNotificationsCtrl($scope,$http,cookieManagement,$location,errorHandler,$window,toastr) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
        vm.baseUrl = cookieManagement.getCookie('SERVICEURL');
        vm.updatedNotification = {};
        $scope.loadingNotifications =  false;
        $scope.notificationParams = {
            enabled: 'False',
            preference_enabled: false
        };

        $scope.boolOptions = ['True','False'];

        $scope.addNotification = function (notificationParams) {
            $scope.loadingNotifications =  true;
            $scope.notificationParams.enabled = $scope.notificationParams.enabled == 'True' ? true : false;
            if(vm.token) {
                $http.post(vm.baseUrl + 'admin/notifications/',notificationParams, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        toastr.success('Notification added successfully');
                        $location.path('/services/notifications/list');
                    }
                }).catch(function (error) {
                    $scope.loadingNotifications =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.goToListView = function () {
            $location.path('/services/notifications/list')
        };

    }
})();
