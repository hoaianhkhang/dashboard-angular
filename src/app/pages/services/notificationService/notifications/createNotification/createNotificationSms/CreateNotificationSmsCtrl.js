(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.notificationService.createNotification.sms')
        .controller('CreateNotificationSmsCtrl', CreateNotificationSmsCtrl);

    /** @ngInject */
    function CreateNotificationSmsCtrl($scope,$http,localStorageManagement,$location,errorHandler,
                                       notificationHtmlTags,toastr,$filter) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.baseUrl = localStorageManagement.getValue('SERVICEURL');
        $scope.addingSmsNotification =  false;
        $scope.smsNotificationParams = {
            enabled: false,
            preference_enabled: false,
            event: '',
            template: ''
        };
        $scope.smsTags = {
            tags: []
        };


        vm.smsEventOptionsObj = {
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

        $scope.smsTemplateOptions = [];
        $scope.smsEventOptions = ['','User Create','User Update','User Password Reset','User Password Set','User Email Verify','User Mobile Verify',
            'Address Create','Address Update','Document Create','Document Update',
            'Bank Account Create','Bank Account Update','Crypto Account Create','Crypto Account Update',
            'Transaction Create','Transaction Update','Transaction Delete','Transaction Initiate','Transaction Execute'];

        $scope.editorSmsOptions = {
            lineWrapping : true,
            lineNumbers: true,
            theme: 'monokai',
            autoCloseTags: true,
            smartIndent: false,
            mode: 'xml'
        };

        $scope.smsExpressionChanged = function () {
            if($scope.smsNotificationParams.smsExpression.length > 150){
                toastr.error('Expression cannot exceed 150 characters');
            }
        };

        $scope.smsEventOptionChanged = function (event) {
            var newTagsArray = notificationHtmlTags.getNotificationHtmlTags(event);
            $scope.smsTags.tags.splice(0,$scope.smsTags.tags.length);
            newTagsArray.forEach(function (element) {
                $scope.smsTags.tags.push(element);
            });
        };

        $scope.getSmsTemplateOptions = function () {
            $scope.addingSmsNotification =  true;
            $http.get(vm.baseUrl + 'admin/templates/?type=sms&page_size=250', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                if (res.status === 200) {
                    $scope.addingSmsNotification =  false;
                    $scope.smsTemplateOptions = res.data.data.results;
                    $scope.smsTemplateOptions.unshift({name: 'No template selected'});
                    $scope.smsNotificationParams.template = $scope.smsTemplateOptions[0];
                }
            }).catch(function (error) {
                $scope.addingSmsNotification =  false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };
        $scope.getSmsTemplateOptions();

        $scope.smsTemplateOptionChanged = function (template) {
            if(template.id){
                $http.get(vm.baseUrl + 'admin/templates/' + template.id + '/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        var templateObj = res.data.data;

                        $scope.smsTemplateOptions.forEach(function (template,index) {
                            if(template.name == templateObj.name){
                                $scope.smsNotificationParams = {
                                    template: $scope.smsTemplateOptions[index],
                                    name: templateObj.name,
                                    description: templateObj.description,
                                    subject: templateObj.subject,
                                    event: $filter('capitalizeDottedSentence')(templateObj.event),
                                    sms_message: templateObj.sms_message,
                                    to_mobile: templateObj.to_mobile,
                                    smsExpression: templateObj.expression,
                                    enabled: false,
                                    preference_enabled: false
                                };
                            }
                        });
                    }
                }).catch(function (error) {
                    $scope.addingSmsNotification =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            } else {
                $scope.smsNotificationParams = {
                    enabled: false,
                    preference_enabled: false,
                    event: '',
                    template: ''
                };
            }
        };

        $scope.addSmsNotification = function () {
            if($scope.smsNotificationParams.event){
                var event;
                event = $scope.smsNotificationParams.event.toUpperCase();
                event = event.replace(/ /g, '_');
                $scope.smsNotificationParams.event = vm.smsEventOptionsObj[event];
            }

            $scope.smsNotificationParams.type = 'sms';

            var smsNotificationObj = {
                name: $scope.smsNotificationParams.name,
                description: $scope.smsNotificationParams.description,
                subject: $scope.smsNotificationParams.subject,
                event: $scope.smsNotificationParams.event,
                sms_message: $scope.smsNotificationParams.sms_message,
                to_mobile: $scope.smsNotificationParams.to_mobile,
                expression: $scope.smsNotificationParams.smsExpression,
                enabled: $scope.smsNotificationParams.enabled,
                preference_enabled: $scope.smsNotificationParams.preference_enabled,
                type: $scope.smsNotificationParams.type
            };

            $scope.addingSmsNotification =  true;
            if(vm.token) {
                $http.post(vm.baseUrl + 'admin/notifications/',smsNotificationObj, {
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
                    $scope.addingSmsNotification =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.goToListView = function () {
            $location.path('/services/notifications/list');
        };

    }
})();
