(function () {
    'use strict';

    angular.module('BlurAdmin.pages.webhooks.list')
        .controller('WebhooksListCtrl', WebhooksListCtrl);

    /** @ngInject */
    function WebhooksListCtrl($scope,environmentConfig,$uibModal,toastr,$filter,$http,$location,cookieManagement,errorHandler,$window,$state) {

        var vm = this;
        vm.updatedWebhook = {};
        vm.token = cookieManagement.getCookie('TOKEN');
        $scope.loadingWebhooks = true;
        $scope.editWebhook = {};

        $scope.webhooksParams = {
            event: 'User Create',
            secret: $state.params.secret || '',
            url: $state.params.webhookUrl || '',
            condition: ''
        };

        vm.eventOptionsObj = {
            USER_CREATE: 'user.create',
            USER_UPDATE: 'user.update',
            USER_PASSWORD_RESET: 'user.password.reset',
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

        $scope.eventOptions = ['User Create','User Update','User Password Reset','User Email Verify','User Mobile Verify',
            'Address Create','Address Update','Document Create','Document Update', 'Bank Account Create','Bank Account Update',
            'Crypto Account Create','Crypto Account Update','Transaction Create','Transaction Update','Transaction Delete',
            'Transaction Initiate','Transaction Execute'];

        var location = $location.path();
        var locationArray = location.split('/');
        $scope.locationIndicator = locationArray[(locationArray.length -1)];

        $scope.toggleWebhooksEditView = function(webhook){
            if(webhook){
                vm.getWebhook(webhook);
            } else{
                $scope.editWebhook = {};
                vm.getWebhooks();
            }
            $scope.editingWebhook = !$scope.editingWebhook;
        };

        vm.getWebhook = function (webhook) {
            $scope.loadingWebhooks = true;
            $http.get(environmentConfig.API + '/admin/webhooks/' + webhook.id + '/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.loadingWebhooks = false;
                if (res.status === 200) {
                    $scope.editWebhook = res.data.data;
                    $scope.editWebhook.event = $filter('capitalizeDottedSentence')(res.data.data.event);
                    $scope.editWebhook.event = $filter('capitalizeUnderscoredSentence')($scope.editWebhook.event);
                }
            }).catch(function (error) {
                $scope.loadingWebhooks = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        vm.getWebhooks = function () {
            if(vm.token) {
                $scope.loadingWebhooks = true;
                $http.get(environmentConfig.API + '/admin/webhooks/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingWebhooks = false;
                    if (res.status === 200) {
                        $scope.webhookList = res.data.data.results;
                        $window.scrollTo(0, 0);
                    }
                }).catch(function (error) {
                    $scope.loadingWebhooks = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        vm.getWebhooks();

        $scope.addWebhooks = function (webhooksParams) {
            $scope.loadingWebhooks = true;

            var event;
            event = webhooksParams.event.toUpperCase();
            event = event.replace(/ /g, '_');
            webhooksParams.event = vm.eventOptionsObj[event];

            $http.post(environmentConfig.API + '/admin/webhooks/', webhooksParams, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.loadingWebhooks = false;
                if (res.status === 201) {
                    vm.getWebhooks();
                    toastr.success('You have successfully added the webhook');
                    $scope.webhooksParams = {event: 'User Create'};
                    $window.scrollTo(0, 0);
                }
            }).catch(function (error) {
                $scope.webhooksParams = {event: 'User Create'};
                $scope.loadingWebhooks = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        $scope.webhookChanged = function(field){
            vm.updatedWebhook[field] = $scope.editWebhook[field];
        };

        $scope.updateWebhook = function () {
            $window.scrollTo(0, 0);
            $scope.editingWebhook = !$scope.editingWebhook;
            $scope.loadingWebhooks = true;
            if(vm.updatedWebhook.event){
                var event = vm.updatedWebhook.event.toUpperCase();
                event = event.replace(/ /g, '_');
                vm.updatedWebhook.event = vm.eventOptionsObj[event];
            }
            $http.patch(environmentConfig.API + '/admin/webhooks/' + $scope.editWebhook.id + '/', vm.updatedWebhook, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.loadingWebhooks = false;
                if (res.status === 200) {
                    vm.updatedWebhook = {};
                    vm.getWebhooks();
                    toastr.success('You have successfully updated the webhook');
                }
            }).catch(function (error) {
                $scope.loadingWebhooks = false;
                vm.updatedWebhook = {};
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        vm.findIndexOfWebhook = function(element){
            return this.id == element.id;
        };

        $scope.openWebhooksModal = function (page, size,webhook) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'WebhooksModalCtrl',
                scope: $scope,
                resolve: {
                    webhook: function () {
                        return webhook;
                    }
                }
            });

            vm.theModal.result.then(function(webhook){
                var index = $scope.webhookList.findIndex(vm.findIndexOfWebhook,webhook);
                $scope.webhookList.splice(index, 1);
            }, function(){
            });
        };
    }
})();
