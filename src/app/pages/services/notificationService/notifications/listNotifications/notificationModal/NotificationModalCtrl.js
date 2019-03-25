(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.notificationService.listNotifications')
        .controller('NotificationModalCtrl', NotificationModalCtrl);

    function NotificationModalCtrl($scope,$uibModalInstance,notification,toastr,$http,localStorageManagement,errorHandler) {

        var vm = this, extensionsList = JSON.parse(localStorageManagement.getValue('extensionsList'));

        $scope.notification = notification;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.baseUrl = extensionsList[4];
        // vm.baseUrl = "https://notification.services.rehive.io/api/";
        $scope.deletingNotification = false;


        $scope.deleteNotification = function () {
            $scope.deletingNotification = true;
            $http.delete(vm.baseUrl + 'admin/notifications/' + $scope.notification.id + '/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.deletingNotification = false;
                if (res.status === 200) {
                    toastr.success('Notification successfully deleted');
                    $uibModalInstance.close($scope.notification);
                }
            }).catch(function (error) {
                $scope.deletingNotification = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };



    }
})();
