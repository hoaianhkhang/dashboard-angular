(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.notificationService.listNotifications')
        .controller('ListNotificationsCtrl', ListNotificationsCtrl);

    /** @ngInject */
    function ListNotificationsCtrl($scope,$http,localStorageManagement,$uibModal,errorHandler,$location,toastr) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.baseUrl = localStorageManagement.getValue('SERVICEURL');
        $scope.allNotifications = {
            all: false,
            count: 0
        };
        $scope.loadingNotifications =  false;
        $scope.listNotificationType = 'email';
        $scope.filtersCount = 0;
        $scope.showingFilters = false;
        $scope.eventOptions = ['','User Create','User Update','User Password Reset','User Password Set','User Email Verify','User Mobile Verify',
            'Address Create','Address Update','Document Create','Document Update',
            'Bank Account Create','Bank Account Update','Crypto Account Create','Crypto Account Update',
            'Transaction Create','Transaction Update','Transaction Delete','Transaction Initiate','Transaction Execute'];

        vm.eventOptionsObj = {
            USER_CREATE: 'user.create',
            USER_UPDATE: 'user.update',
            USER_PASSWORD_RESET: 'user.password.reset',
            USER_PASSWORD_SET: 'user.password.set',
            USER_EMAIL_VERIFY: 'user.email.verify',
            USER_MOBILE_VERIFY: 'user.mobile.verify',
            ADDRESS_CREATE: 'address.create',
            ADDRESS_UPDATE: 'address.update',
            DOCUMENT_CREATE: 'document.create',
            DOCUMENT_UPDATE: 'document.update',
            BANK_ACCOUNT_CREATE: 'bank_account.create',
            BANK_ACCOUNT_UPDATE: 'bank_account.update',
            CRYPTO_ACCOUNT_CREATE: 'crypto_account.create',
            CRYPTO_ACCOUNT_UPDATE: 'crypto_account.update',
            TRANSACTION_CREATE: 'transaction.create',
            TRANSACTION_UPDATE: 'transaction.update',
            TRANSACTION_DELETE: 'transaction.delete',
            TRANSACTION_INITIATE: 'transaction.initiate',
            TRANSACTION_EXECUTE: 'transaction.execute'
        };

        $scope.pagination = {
            itemsPerPage: 20,
            pageNo: 1,
            maxSize: 5
        };

        $scope.filtersObj = {
            nameFilter: false,
            eventFilter: false
        };
        $scope.applyFiltersObj = {
            nameFilter: {
                selectedName: ''
            },
            eventFilter: {
                selectedEvent: ''
            }
        };

        $scope.clearFilters = function () {
            $scope.filtersObj = {
                nameFilter: false,
                eventFilter: false
            };
        };

        $scope.showFilters = function () {
            $scope.showingFilters = !$scope.showingFilters;
        };

        $scope.goToListNotificationType = function (path) {
            $scope.listNotificationType = path;
            $scope.clearFilters();
            $scope.getNotificationsList();
        };

        // $scope.toggleAllNotificationsStatus = function () {
        //     $scope.notificationsList.forEach(function (notification) {
        //         notification.enabled = $scope.allNotifications.enabled;
        //         $scope.toggleNotificationStatus(notification);
        //     });
        // };

        vm.getNotificationListUrl = function(){
            var event = '';
            if($scope.filtersObj.eventFilter){
                event = $scope.applyFiltersObj.eventFilter.selectedEvent.toUpperCase();
                event = event.replace(/ /g, '_');
                event = vm.eventOptionsObj[event];
            }

            vm.filterParams = '?page=' + $scope.pagination.pageNo + '&page_size=' + $scope.pagination.itemsPerPage +
                '&type=' + $scope.listNotificationType +
                ($scope.filtersObj.nameFilter ? '&name=' + $scope.applyFiltersObj.nameFilter.selectedName : '') +
                ($scope.filtersObj.eventFilter ? '&event=' + event : ''); // all the params of the filtering

            return vm.baseUrl + 'admin/notifications/' + vm.filterParams;
        };

        $scope.getNotificationsList = function (applyFilter) {
            $scope.loadingNotifications =  true;
            $scope.showingFilters = false;
            $scope.notificationsList = [];
            $scope.allNotifications = {
                enabled: false,
                count: 0
            };

            if (applyFilter) {
                // if function is called from history-filters directive, then pageNo set to 1
                $scope.pagination.pageNo = 1;
            }

            if ($scope.notificationsList.length > 0) {
                $scope.notificationsList.length = 0;
            }

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
                $http.patch(vm.baseUrl + 'admin/notifications/' + notification.id + '/',{enabled: notification.enabled,type: notification.type}, {
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

        vm.findIndexOfNotification = function(element){
            return this.id == element.id;
        };

        $scope.openNotificationModal = function (page, size,notification) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'NotificationModalCtrl',
                scope: $scope,
                resolve: {
                    notification: function () {
                        return notification;
                    }
                }
            });

            vm.theModal.result.then(function(notification){
                if(notification){
                    $scope.getNotificationsList();
                }
            }, function(){
            });
        };

        $scope.goToCreateNotification = function () {
            $location.path('/services/notifications/create/email');
        };

        $scope.goToBulkAdd = function () {
            $location.path('/services/notifications/bulk/add');
        };

    }

})();
