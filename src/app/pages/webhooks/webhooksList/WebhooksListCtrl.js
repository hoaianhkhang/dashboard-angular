(function () {
    'use strict';

    angular.module('BlurAdmin.pages.webhooks.list')
        .controller('WebhooksListCtrl', WebhooksListCtrl);

    /** @ngInject */
    function WebhooksListCtrl($scope,Rehive,$uibModal,$location,localStorageManagement,errorHandler,$window,$state) {

        var vm = this;
        vm.updatedWebhook = {};
        vm.token = localStorageManagement.getValue('token');
        $scope.loadingWebhooks = true;

        var location = $location.path();
        var locationArray = location.split('/');
        $scope.locationIndicator = locationArray[(locationArray.length -1)];

        vm.getWebhooks = function () {
            if(vm.token) {
                $scope.loadingWebhooks = true;
                Rehive.admin.webhooks.get().then(function (res) {
                    $scope.loadingWebhooks = false;
                    $scope.webhookList = res.results;
                    $window.scrollTo(0, 0);
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingWebhooks = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.getWebhooks();

        $scope.openCreateWebhookModal = function (page, size) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'AddWebhookModalCtrl',
                scope: $scope,
                resolve: {
                    webhookUrl: function () {
                        return $state.params.webhookUrl || '';
                    },
                    secret: function () {
                        return $state.params.secret || '';
                    }
                }
            });

            vm.theModal.result.then(function(webhook){
                if(webhook){
                    vm.getWebhooks();
                }
            }, function(){
            });
        };

        $scope.openEditWebhookModal = function (page, size,webhook) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'EditWebhookModalCtrl',
                scope: $scope,
                resolve: {
                    webhook: function () {
                        return webhook;
                    }
                }
            });

            vm.theModal.result.then(function(webhook){
                if(webhook){
                    vm.getWebhooks();
                }
            }, function(){
            });
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
                if(webhook){
                    vm.getWebhooks();
                }
            }, function(){
            });
        };

        if($state.params.secret || $state.params.webhookUrl){
            $scope.openCreateWebhookModal('app/pages/webhooks/webhooksList/addWebhookModal/addWebhookModal.html','md');
        }
    }
})();
