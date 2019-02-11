(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.notificationService.notificationServiceLogs')
        .controller('NotificationServiceLogsCtrl', NotificationServiceLogsCtrl);

    /** @ngInject */
    function NotificationServiceLogsCtrl($rootScope, $scope,$http,localStorageManagement,$uibModal,errorHandler) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.baseUrl = localStorageManagement.getValue('SERVICEURL');
        $rootScope.dashboardTitle = 'Notification service | Rehive';
        $scope.loadingLogs =  false;
        $scope.notificationLogs = [];

        $scope.pagination = {
            itemsPerPage: 25,
            pageNo: 1,
            maxSize: 5
        };

        vm.getNotificationLogsUrl = function(){

            vm.filterParams = '?page=' + $scope.pagination.pageNo + '&page_size=' + $scope.pagination.itemsPerPage; // all the params of the filtering

            return vm.baseUrl + 'admin/logs/' + vm.filterParams;
        };

        $scope.getNotificationLogs = function () {
            $scope.loadingLogs =  true;

            var notificationLogsUrl = vm.getNotificationLogsUrl();

            if(vm.token) {
                $http.get(notificationLogsUrl, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingLogs =  false;
                    if (res.status === 200) {
                        $scope.notificationLogsData = res.data.data;
                        $scope.notificationLogs = res.data.data.results;
                    }
                }).catch(function (error) {
                    $scope.loadingLogs =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        $scope.getNotificationLogs();

        $scope.openNotificationServiceLogsResendModal = function (page, size,log) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'NotificationServiceLogsResendModalCtrl',
                resolve: {
                    log: function () {
                        return log;
                    }
                }
            });

            vm.theModal.result.then(function(log){
                if(log){
                    $scope.getNotificationLogs();
                }
            }, function(){
            });
        };

        $scope.openNotificationServiceLogsModal = function (page, size,log) {
            $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'NotificationServiceLogsModalCtrl',
                resolve: {
                    log: function () {
                        return log;
                    }
                }
            });
        };


    }
})();
