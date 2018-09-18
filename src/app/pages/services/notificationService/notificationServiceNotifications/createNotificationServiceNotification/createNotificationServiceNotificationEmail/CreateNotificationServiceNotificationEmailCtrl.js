(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.notificationService.createNotificationServiceNotification')
        .controller('CreateNotificationServiceNotificationEmailCtrl', CreateNotificationServiceNotificationEmailCtrl);

    /** @ngInject */
    function CreateNotificationServiceNotificationEmailCtrl($scope,$http,localStorageManagement,notificationHtmlTags,
                                                            $uibModal,$location,errorHandler,toastr,$filter) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.baseUrl = localStorageManagement.getValue('SERVICEURL');
        $scope.addingEmailNotification =  false;
        $scope.emailNotificationParams = {
            enabled: false,
            preference_enabled: false,
            event: '',
            template: ''
        };
        $scope.htmlTags = {
            tags: []
        };

        vm.emailEventOptionsObj = {
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

        $scope.editorEmailOptions = {
            lineWrapping : true,
            lineNumbers: true,
            theme: 'monokai',
            autoCloseTags: true,
            smartIndent: false,
            mode: 'xml'
        };

        $scope.emailTemplateOptions = ['','Email'];
        $scope.emailEventOptions = ['','User Create','User Update','User Password Reset','User Password Set','User Email Verify','User Mobile Verify',
            'Address Create','Address Update','Document Create','Document Update',
            'Bank Account Create','Bank Account Update','Crypto Account Create','Crypto Account Update',
            'Transaction Create','Transaction Update','Transaction Delete','Transaction Initiate','Transaction Execute'];

        $scope.emailEventOptionChanged = function (event) {
            var newTagsArray = notificationHtmlTags.getNotificationHtmlTags(event);
            $scope.htmlTags.tags.splice(0,$scope.htmlTags.tags.length);
            newTagsArray.forEach(function (element) {
                $scope.htmlTags.tags.push(element);
            });
        };

        $scope.emailTemplateOptionChanged = function (template) {
            if(template){
                $http.get(vm.baseUrl + 'admin/templates/?type=' + template.toLowerCase(), {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        var templateObj = res.data.data.results[0];
                        $scope.emailNotificationParams = {
                            template: $filter('capitalizeWord')(templateObj.type),
                            name: templateObj.name,
                            description: templateObj.description,
                            subject: templateObj.subject,
                            event: $filter('capitalizeDottedSentence')(templateObj.event),
                            html_message: templateObj.html_message,
                            text_message: templateObj.text_message,
                            to_email: templateObj.to_email,
                            expression: templateObj.expression,
                            enabled: false,
                            preference_enabled: false
                        };
                    }
                }).catch(function (error) {
                    $scope.addingEmailNotification =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            } else {
                $scope.emailNotificationParams = {
                    enabled: false,
                    preference_enabled: false,
                    event: '',
                    template: ''
                };
            }
        };

        $scope.addEmailNotification = function () {
            if($scope.emailNotificationParams.event){
                var event;
                event = $scope.emailNotificationParams.event.toUpperCase();
                event = event.replace(/ /g, '_');
                $scope.emailNotificationParams.event = vm.emailEventOptionsObj[event];
            }

            $scope.emailNotificationParams.type = 'email';

            var emailNotificationObj = {
                name: $scope.emailNotificationParams.name,
                description: $scope.emailNotificationParams.description,
                subject: $scope.emailNotificationParams.subject,
                event: $scope.emailNotificationParams.event,
                html_message: $scope.emailNotificationParams.html_message,
                text_message: $scope.emailNotificationParams.text_message,
                to_email: $scope.emailNotificationParams.to_email,
                expression: $scope.emailNotificationParams.expression,
                enabled: $scope.emailNotificationParams.enabled,
                preference_enabled: $scope.emailNotificationParams.preference_enabled,
                type: $scope.emailNotificationParams.type
            };

            $scope.addingEmailNotification =  true;
            if(vm.token) {
                $http.post(vm.baseUrl + 'admin/notifications/',emailNotificationObj, {
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
                    $scope.addingEmailNotification =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.goToListView = function () {
            $location.path('/services/notifications/list');
        };

        $scope.openHtmlPreviewModal = function (page, size, htmlPreview) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'HtmlMessagePreviewModalCtrl',
                scope: $scope,
                resolve: {
                    htmlPreview: function () {
                        return htmlPreview;
                    }
                }
            });

            vm.theModal.result.then(function(){
            }, function(){
            });
        };

    }
})();
