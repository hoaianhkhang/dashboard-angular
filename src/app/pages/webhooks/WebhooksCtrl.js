(function () {
    'use strict';

    angular.module('BlurAdmin.pages.webhooks')
        .controller('WebhooksCtrl', WebhooksCtrl);

    /** @ngInject */
    function WebhooksCtrl($scope,environmentConfig,$uibModal,toastr,$filter,$http,$location,cookieManagement,errorHandler,$window,$state) {

        var vm = this;
        vm.updatedWebhook = {};
        vm.token = cookieManagement.getCookie('TOKEN');
        $scope.loadingWebhooks = true;

        $scope.goToSetting = function(path){
            $scope.settingView = '';
            $location.path(path);
        };
    }
})();
