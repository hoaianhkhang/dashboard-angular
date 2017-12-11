(function () {
    'use strict';

    angular.module('BlurAdmin.pages.webhooks.log')
        .controller('WebhookLogModalCtrl', WebhookLogModalCtrl);

    function WebhookLogModalCtrl($uibModalInstance,$http,$scope,errorHandler,toastr,
                              webhookTask,metadataTextService,environmentConfig,cookieManagement) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
        $scope.user = metadataTextService.convertToText(webhookTask.data.data.user);
        $scope.destination_transaction = metadataTextService.convertToText(webhookTask.data.data.destination_transaction);
        $scope.source_transaction = metadataTextService.convertToText(webhookTask.data.data.source_transaction);
        $scope.formatted = {};
        $scope.formatted.metadata = metadataTextService.convertToText(webhookTask.data.data.metadata);
        $scope.webhookTask = webhookTask;
        console.log(webhookTask.data.data);





    }
})();
