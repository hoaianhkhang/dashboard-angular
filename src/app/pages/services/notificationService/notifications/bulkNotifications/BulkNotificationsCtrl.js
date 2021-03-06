(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.notificationService.bulkNotifications')
        .controller('BulkNotificationsCtrl', BulkNotificationsCtrl);

    /** @ngInject */
    function BulkNotificationsCtrl($scope,$http,localStorageManagement,_,errorHandler,$location,toastr) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        // vm.baseUrl = localStorageManagement.getValue('SERVICEURL');
        vm.baseUrl = "https://notification.services.rehive.io/api/";
        $scope.allBulkNotifications = {
            emailBulkEnabled : false,
            smsBulkEnabled : false
        };
        $scope.addingBulkNotification = false;
        $scope.bulkEmailEventOptions = [];
        $scope.bulkSmsEventOptions = [];

        $scope.getEmailTemplate = function () {
            $scope.addingBulkNotification = true;
            $http.get(vm.baseUrl + 'admin/templates/?type=email&page_size=250', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                if (res.status === 200) {
                    $scope.bulkEmailEventOptions = res.data.data.results;
                    $scope.getSmsTemplate();
                }
            }).catch(function (error) {
                $scope.addingBulkNotification = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };
        $scope.getEmailTemplate();

        $scope.getSmsTemplate = function () {
            $scope.addingBulkNotification = true;
            $http.get(vm.baseUrl + 'admin/templates/?type=sms&page_size=250', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                if (res.status === 200) {
                    $scope.addingBulkNotification = false;
                    $scope.bulkSmsEventOptions = res.data.data.results;
                }
            }).catch(function (error) {
                $scope.addingBulkNotification = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        $scope.toggleAllBulkNotificationsStatus = function (bulkArray,type) {
            bulkArray.forEach(function (notif) {
                if(type == 'email'){
                    if($scope.allBulkNotifications.emailBulkEnabled){
                        notif.enabled = true;
                    } else{
                        notif.enabled = false;
                    }
                } else {
                    if($scope.allBulkNotifications.smsBulkEnabled){
                        notif.enabled = true;
                    } else{
                        notif.enabled = false;
                    }
                }
            });
        };

        $scope.bulkSmsEventChanged = function () {
            var smsEnabledCount = 0;
            $scope.bulkSmsEventOptions.forEach(function (notif) {
                if(notif.enabled){
                    smsEnabledCount = smsEnabledCount + 1;
                }
            });
            if(smsEnabledCount == $scope.bulkSmsEventOptions.length){
                $scope.allBulkNotifications.smsBulkEnabled = true;
            } else {
                $scope.allBulkNotifications.smsBulkEnabled = false;
            }
        };

        $scope.bulkEmailEventChanged = function () {
            var emailEnabledCount = 0;
            $scope.bulkEmailEventOptions.forEach(function (notif) {
                if(notif.enabled){
                    emailEnabledCount = emailEnabledCount + 1;
                }
            });
            if(emailEnabledCount == $scope.bulkEmailEventOptions.length){
                $scope.allBulkNotifications.emailBulkEnabled = true;
            } else {
                $scope.allBulkNotifications.emailBulkEnabled = false;
            }
        };

        $scope.findEnabledNotifications = function () {
            var enabledEmailEventsArray =[];
            var enabledSmsEventsArray =[];

            $scope.bulkEmailEventOptions.forEach(function (emailNotif,index,arr) {
                if(emailNotif.enabled){
                    enabledEmailEventsArray.push(emailNotif);
                }
            });

            $scope.bulkSmsEventOptions.forEach(function (smsNotif,index,arr) {
                if(smsNotif.enabled){
                    enabledSmsEventsArray.push(smsNotif);
                }
            });

            vm.addBulkNotifications(0, enabledEmailEventsArray,enabledSmsEventsArray);
        };

        vm.addBulkNotifications = function (callIdx, enabledEmailEventsArray,enabledSmsEventsArray) {
            console.log(enabledEmailEventsArray);
            /*
            if(enabledEmailEventsArray.length > 0){
                enabledEmailEventsArray.forEach(function (emailNotif,index,arr) {
                    if(index == (arr.length - 1)){
                        // last email notification
                        if(enabledSmsEventsArray.length > 0){
                            vm.addNotification(emailNotif,null,'email');
                        } else {
                            vm.addNotification(emailNotif,'last','email');
                        }
                        // iterating over the sms array
                        enabledSmsEventsArray.forEach(function (smsNotif,smsIndex,smsArr) {
                            if(smsIndex == (smsArr.length - 1)){
                                vm.addNotification(smsNotif,'last','sms');
                            } else {
                                vm.addNotification(smsNotif,null,'sms');
                            }
                        });
                    } else {
                        vm.addNotification(emailNotif,null,'email');
                    }
                });
            } */
            var emailArrLen = enabledEmailEventsArray.length, smsArrLen = enabledSmsEventsArray.length;
            if(emailArrLen > 0 && callIdx < emailArrLen){
                if(callIdx == (emailArrLen - 1)){
                    if(smsArrLen > 0){
                        vm.addNotification(callIdx, enabledEmailEventsArray,enabledSmsEventsArray, enabledEmailEventsArray[callIdx],null,'email');
                    } else {
                        vm.addNotification(callIdx, enabledEmailEventsArray,enabledSmsEventsArray, enabledEmailEventsArray[callIdx],'last','email');
                    }
                    for(var smsIndex = 0; smsIndex < smsArrLen; ++smsIndex) {
                        if(smsIndex === (smsArrLen - 1)){
                            vm.addNotification(callIdx, null, null, enabledSmsEventsArray[smsIndex],'last','sms');
                        } else {
                            vm.addNotification(callIdx, null,null, enabledSmsEventsArray[smsIndex],null,'sms');
                        }
                    }
                } else {
                    vm.addNotification(callIdx, enabledEmailEventsArray,enabledSmsEventsArray, enabledEmailEventsArray[callIdx],null, 'email');
                }
            }
            else {
                for(var smsIndex = 0; smsIndex < smsArrLen; ++smsIndex) {
                    if(smsIndex === (smsArrLen - 1)){
                        vm.addNotification(callIdx, null, null, enabledSmsEventsArray[smsIndex],'last','sms');
                    } else {
                        vm.addNotification(callIdx, null,null, enabledSmsEventsArray[smsIndex],null,'sms');
                    }
                }
            }
        };

        vm.addNotification = function (callIdx, enabledEmailEventsArray,enabledSmsEventsArray, notification,last,type) {
            var notificationObj = {};

            if(type == 'email'){
                notificationObj = {
                    name: notification.name,
                    description: notification.description,
                    subject: notification.subject,
                    event: notification.event,
                    html_message: notification.html_message,
                    text_message: notification.text_message,
                    to_email: notification.to_email,
                    expression: notification.expression,
                    enabled: notification.enabled,
                    preference_enabled: false,
                    type: 'email'
                };
            } else {
                notificationObj = {
                    name: notification.name,
                    description: notification.description,
                    subject: notification.subject,
                    event: notification.event,
                    sms_message: notification.sms_message,
                    to_mobile: notification.to_mobile,
                    expression: notification.expression,
                    enabled: notification.enabled,
                    preference_enabled: false,
                    type: 'sms'
                };
            }

            $scope.addingBulkNotification =  true;
            if(vm.token) {
                $http.post(vm.baseUrl + 'admin/notifications/',notificationObj, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200 || res.status === 201) {
                        if(last){
                            toastr.success('Bulk notifications added successfully');
                            // $location.path('/services/notifications/list');
                            $location.path('/extensions/notifications/list');
                        }
                        else if(enabledEmailEventsArray){
                            ++callIdx;
                            vm.addBulkNotifications(callIdx, enabledEmailEventsArray, enabledSmsEventsArray);
                        }
                    }
                }).catch(function (error) {
                    $scope.addingBulkNotification =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.goBackListView = function () {
            // $location.path('/services/notifications/list');
            $location.path('/extensions/notifications/list');
        };


    }
})();
