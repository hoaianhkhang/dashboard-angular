(function () {
    'use strict';

    angular.module('BlurAdmin.pages.webhooks')
        .controller('WebhooksCtrl', WebhooksCtrl);

    /** @ngInject */
    function WebhooksCtrl($rootScope,$scope,$location,cookieManagement) {

        var vm = this;
        vm.updatedWebhook = {};
        vm.token = cookieManagement.getCookie('TOKEN');
        $rootScope.dashboardTitle = 'Rehive | Webhooks';
        $scope.loadingWebhooks = true;

        $scope.goToSetting = function(path){
            $scope.settingView = '';
            $location.path(path);
        };
    }
})();
