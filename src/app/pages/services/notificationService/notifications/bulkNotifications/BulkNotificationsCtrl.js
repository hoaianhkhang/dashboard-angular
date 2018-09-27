(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.notificationService.bulkNotifications')
        .controller('BulkNotificationsCtrl', BulkNotificationsCtrl);

    /** @ngInject */
    function BulkNotificationsCtrl($scope,$http,localStorageManagement,_,errorHandler,$location,toastr) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.baseUrl = localStorageManagement.getValue('SERVICEURL');
        $scope.allBulkNotifications = {
            emailBulkEnabled : false,
            smsBulkEnabled : false
        };
        $scope.addingBulkNotification = false;
        $scope.emailTemplateObj = {};
        $scope.smsTemplateObj = {};

        vm.bulkEventOptionsObj = {
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
        $scope.bulkEmailEventOptions = [
            {event: 'User Create', enabled: false},
            {event: 'User Update', enabled: false},
            {event: 'User Password Reset', enabled: false},
            {event: 'User Password Set', enabled: false},
            {event: 'User Email Verify', enabled: false},
            {event: 'User Mobile Verify', enabled: false},
            {event: 'Address Create', enabled: false},
            {event: 'Address Update', enabled: false},
            {event: 'Document Create', enabled: false},
            {event: 'Document Update', enabled: false},
            {event: 'Bank Account Create', enabled: false},
            {event: 'Bank Account Update', enabled: false},
            {event: 'Crypto Account Create', enabled: false},
            {event: 'Crypto Account Update', enabled: false},
            {event: 'Transaction Create', enabled: false},
            {event: 'Transaction Update', enabled: false},
            {event: 'Transaction Delete', enabled: false},
            {event: 'Transaction Initiate', enabled: false},
            {event: 'Transaction Execute', enabled: false}
            ];

        $scope.bulkSmsEventOptions = [
            {event: 'User Create', enabled: false},
            {event: 'User Update', enabled: false},
            {event: 'User Password Reset', enabled: false},
            {event: 'User Password Set', enabled: false},
            {event: 'User Email Verify', enabled: false},
            {event: 'User Mobile Verify', enabled: false},
            {event: 'Address Create', enabled: false},
            {event: 'Address Update', enabled: false},
            {event: 'Document Create', enabled: false},
            {event: 'Document Update', enabled: false},
            {event: 'Bank Account Create', enabled: false},
            {event: 'Bank Account Update', enabled: false},
            {event: 'Crypto Account Create', enabled: false},
            {event: 'Crypto Account Update', enabled: false},
            {event: 'Transaction Create', enabled: false},
            {event: 'Transaction Update', enabled: false},
            {event: 'Transaction Delete', enabled: false},
            {event: 'Transaction Initiate', enabled: false},
            {event: 'Transaction Execute', enabled: false}
        ];

        $scope.getEmailTemplate = function () {
            $http.get(vm.baseUrl + 'admin/templates/?type=email', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                if (res.status === 200) {
                    $scope.emailTemplateObj = res.data.data.results[0];
                }
            }).catch(function (error) {
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };
        $scope.getEmailTemplate();

        $scope.getSmsTemplate = function () {
            $http.get(vm.baseUrl + 'admin/templates/?type=sms', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                if (res.status === 200) {
                    $scope.smsTemplateObj = res.data.data.results[0];
                }
            }).catch(function (error) {
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };
        $scope.getSmsTemplate();

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
            if(smsEnabledCount == 19){
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
            if(emailEnabledCount == 19){
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

            vm.addBulkNotifications(enabledEmailEventsArray,enabledSmsEventsArray);
        };

        vm.addBulkNotifications = function (enabledEmailEventsArray,enabledSmsEventsArray) {
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
            } else {
                enabledSmsEventsArray.forEach(function (smsNotif,smsIndex,smsArr) {
                    if(smsIndex == (smsArr.length - 1)){
                        vm.addNotification(smsNotif,'last','sms');
                    } else {
                        vm.addNotification(smsNotif,null,'sms');
                    }
                });
            }
        };

        vm.addNotification = function (notification,last,type) {
            if(notification.event){
                var event;
                event = notification.event.toUpperCase();
                event = event.replace(/ /g, '_');
                notification.event = vm.bulkEventOptionsObj[event];
            }

            var notificationObj = {};

            if(type == 'email'){
                notificationObj = {
                    name: $scope.emailTemplateObj.name,
                    description: $scope.emailTemplateObj.description,
                    subject: $scope.emailTemplateObj.subject,
                    event: notification.event,
                    html_message: $scope.emailTemplateObj.html_message,
                    text_message: $scope.emailTemplateObj.text_message,
                    to_email: $scope.emailTemplateObj.to_email,
                    expression: $scope.emailTemplateObj.expression,
                    enabled: notification.enabled,
                    preference_enabled: false,
                    type: 'email'
                };
            } else {
                notificationObj = {
                    name: $scope.smsTemplateObj.name,
                    description: $scope.smsTemplateObj.description,
                    subject: $scope.smsTemplateObj.subject,
                    event: notification.event,
                    sms_message: $scope.smsTemplateObj.sms_message,
                    to_mobile: $scope.smsTemplateObj.to_mobile,
                    expression: $scope.smsTemplateObj.expression,
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
                            $location.path('/services/notifications/list');
                        }
                    }
                }).catch(function (error) {
                    $scope.addingBulkNotification =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.goBackToListView = function () {
            $location.path('/services/notifications/list');
        };


    }
})();
