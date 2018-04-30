(function () {
    'use strict';

    angular.module('BlurAdmin.pages.webhooks')
        .controller('WebhooksCtrl', WebhooksCtrl);

    /** @ngInject */
    function WebhooksCtrl($rootScope,$scope,$location,localStorageManagement,$state) {

        var vm = this;
        vm.updatedWebhook = {};
        vm.token = localStorageManagement.getValue('TOKEN');
        $rootScope.dashboardTitle = 'Webhooks | Rehive';
        $scope.loadingWebhooks = true;

        $scope.$on('$locationChangeStart', function (event,newUrl) {
            vm.location = $location.path();
            vm.locationArray = vm.location.split('/');
            $scope.locationIndicator = vm.locationArray[vm.locationArray.length - 1];
            if($scope.locationIndicator == 'webhooks'){
                $state.go('webhooks.list');
            }
        });

    }
})();
