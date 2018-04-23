(function () {
    'use strict';

    angular.module('BlurAdmin.pages.webhooks')
        .controller('WebhooksModalCtrl', WebhooksModalCtrl);

    function WebhooksModalCtrl($scope,$uibModalInstance,webhook,toastr,$http,environmentConfig,localStorageManagement,errorHandler) {

        var vm = this;

        $scope.webhook = webhook;
        $scope.deletingWebhook = false;
        vm.token = localStorageManagement.getValue('TOKEN');

        $scope.deleteWebhook = function () {
            $scope.deletingWebhook = true;
            $http.delete(environmentConfig.API + '/admin/webhooks/' + $scope.webhook.id + '/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.deletingWebhook = false;
                if (res.status === 200) {
                    toastr.success('Webhook successfully deleted');
                    $uibModalInstance.close($scope.webhook);
                }
            }).catch(function (error) {
                $scope.deletingWebhook = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };



    }
})();
