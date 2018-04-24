(function () {
    'use strict';

    angular.module('BlurAdmin.pages.webhooks.list')
        .controller('AddWebhookModalCtrl', AddWebhookModalCtrl);

    /** @ngInject */
    function AddWebhookModalCtrl($scope,environmentConfig,$uibModalInstance,toastr,webhookUrl,
                                 secret,$http,localStorageManagement,errorHandler) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        $scope.addingWebhook = false;

        $scope.webhooksParams = {
            event: 'User Create',
            secret: secret || '',
            url: webhookUrl || '',
            condition: ''
        };

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

        $scope.eventOptions = ['User Create','User Update','User Password Reset','User Password Set','User Email Verify','User Mobile Verify',
            'Address Create','Address Update','Document Create','Document Update', 'Bank Account Create','Bank Account Update',
            'Crypto Account Create','Crypto Account Update','Transaction Create','Transaction Update','Transaction Delete',
            'Transaction Initiate','Transaction Execute'];

        $scope.addWebhooks = function (webhooksParams) {
            $scope.addingWebhook = true;

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
                $scope.addingWebhook = false;
                if (res.status === 201) {
                    toastr.success('You have successfully added the webhook');
                    $uibModalInstance.close(true);
                }
            }).catch(function (error) {
                $scope.webhooksParams = {event: 'User Create'};
                $scope.addingWebhook = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

    }
})();
