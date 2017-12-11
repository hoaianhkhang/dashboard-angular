(function () {
    'use strict';

    angular.module('BlurAdmin.pages.webhooks')
        .directive('editWebhook', editWebhook);

    /** @ngInject */
    function editWebhook() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/webhooks/webhooksList/editWebhook/editWebhook.html'
        };
    }
})();
