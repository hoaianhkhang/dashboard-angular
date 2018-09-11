(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.notificationService.createNotificationServiceNotification')
        .controller('HtmlMessagePreviewModalCtrl', HtmlMessagePreviewModalCtrl);

    /** @ngInject */
    function HtmlMessagePreviewModalCtrl($scope,localStorageManagement,$uibModalInstance,
                                         htmlPreview,errorHandler) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        $scope.htmlPreview = htmlPreview;

    }
})();
