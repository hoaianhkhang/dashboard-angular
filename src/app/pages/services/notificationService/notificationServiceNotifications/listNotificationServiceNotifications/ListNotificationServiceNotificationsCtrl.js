(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.notificationService.listNotificationServiceNotifications')
        .controller('ListNotificationServiceNotificationsCtrl', ListNotificationServiceNotificationsCtrl);

    /** @ngInject */
    function ListNotificationServiceNotificationsCtrl($scope,$http,localStorageManagement,$uibModal,errorHandler,$location,toastr) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.baseUrl = localStorageManagement.getValue('SERVICEURL');
        $scope.allNotifications = {
            enabled: false,
            count: 0
        };
        $scope.loadingNotifications =  false;

        $scope.pagination = {
            itemsPerPage: 20,
            pageNo: 1,
            maxSize: 5
        };

        $scope.toggleAllNotificationsStatus = function () {
            $scope.notificationsList.forEach(function (notification) {
                notification.enabled = $scope.allNotifications.enabled;
                $scope.toggleNotificationStatus(notification);
            });
        };

        vm.getNotificationListUrl = function(){

            vm.filterParams = '?page=' + $scope.pagination.pageNo + '&page_size=' + $scope.pagination.itemsPerPage; // all the params of the filtering

            return vm.baseUrl + 'admin/notifications/' + vm.filterParams;
        };

        $scope.getNotificationsList = function () {
            $scope.loadingNotifications =  true;
            $scope.notificationsList = [];

            var notificationListUrl = vm.getNotificationListUrl();

            if(vm.token) {
                $http.get(notificationListUrl, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingNotifications =  false;
                    if (res.status === 200) {
                        $scope.notificationsListData = res.data.data;
                        $scope.notificationsList = res.data.data.results;
                        $scope.notificationsList.forEach(function (notification,index,array) {
                            if(notification.enabled){
                                $scope.allNotifications.count = $scope.allNotifications.count + 1;
                            }
                            if(index == (array.length - 1)){
                                if($scope.allNotifications.count == $scope.notificationsListData.count){
                                    $scope.allNotifications.enabled = true;
                                }
                            }
                        });
                    }
                }).catch(function (error) {
                    $scope.loadingNotifications =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        $scope.getNotificationsList();

        $scope.toggleNotificationStatus = function (notification) {
            if(vm.token) {
                $http.patch(vm.baseUrl + 'admin/notifications/' + notification.id + '/',{enabled: notification.enabled}, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        if(notification.enabled){
                            $scope.allNotifications.count = $scope.allNotifications.count + 1;
                            if($scope.allNotifications.count == $scope.notificationsListData.count){
                                $scope.allNotifications.enabled = true;
                            }
                        } else {
                            $scope.allNotifications.count = $scope.allNotifications.count - 1;
                            $scope.allNotifications.enabled = false;
                        }
                        toastr.success('Notification updated successfully');
                    }
                }).catch(function (error) {
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.goToAddNotificationView = function () {
            $location.path('/services/notifications/create');
        };

        $scope.goToNotificationEditView = function (notification) {
            $location.path('/services/notifications/' + notification.id + '/edit');
        };

        vm.findIndexOfNotification = function(element){
            return this.id == element.id;
        };

        $scope.openNotificationModal = function (page, size,notification) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'NotificationServiceNotificationModalCtrl',
                scope: $scope,
                resolve: {
                    notification: function () {
                        return notification;
                    }
                }
            });

            vm.theModal.result.then(function(notification){
                var index = $scope.notificationsList.findIndex(vm.findIndexOfNotification,notification);
                $scope.notificationsList.splice(index, 1);
            }, function(){
            });
        };


    }

})();
