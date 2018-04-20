(function () {
    'use strict';

    angular.module('BlurAdmin.pages.webhooks')
        .controller('WebhooksCtrl', WebhooksCtrl);

    /** @ngInject */
    function WebhooksCtrl($rootScope,$scope,$location,localStorageManagement) {

        var vm = this;
        vm.updatedWebhook = {};
        vm.token = localStorageManagement.getValue('TOKEN');
        $rootScope.dashboardTitle = 'Webhooks | Rehive';
        $scope.loadingWebhooks = true;

        $scope.goToSetting = function(path){
            $scope.settingView = '';
            $location.path(path);
        };
    }
})();
