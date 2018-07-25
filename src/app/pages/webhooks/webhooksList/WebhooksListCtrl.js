(function () {
    'use strict';

    angular.module('BlurAdmin.pages.webhooks.list')
        .controller('WebhooksListCtrl', WebhooksListCtrl);

    /** @ngInject */
    function WebhooksListCtrl($scope,environmentConfig,$uibModal,toastr,serializeFiltersService,
                              $http,$location,localStorageManagement,errorHandler,$window,$state) {

        var vm = this;
        vm.updatedWebhook = {};
        vm.token = localStorageManagement.getValue('TOKEN');
        $scope.loadingWebhooks = true;

        var location = $location.path();
        var locationArray = location.split('/');
        $scope.locationIndicator = locationArray[(locationArray.length -1)];

        $scope.pagination = {
            itemsPerPage: 25,
            pageNo: 1,
            maxSize: 5
        };

        vm.getWebhooksUrl = function(){
            var searchObj = {
                page: $scope.pagination.pageNo,
                page_size: $scope.pagination.itemsPerPage || 25
            };

            return environmentConfig.API + '/admin/webhooks/?' + serializeFiltersService.serializeFilters(searchObj);
        };

        $scope.getWebhooks = function () {
            if(vm.token) {
                $scope.loadingWebhooks = true;

                var webhooksUrl = vm.getWebhooksUrl();

                $http.get(webhooksUrl, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingWebhooks = false;
                    if (res.status === 200) {
                        $scope.webhooksData = res.data.data;
                        $scope.webhookList = res.data.data.results;
                        $window.scrollTo(0, 0);
                    }
                }).catch(function (error) {
                    $scope.loadingWebhooks = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        $scope.getWebhooks();

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
                    $scope.getWebhooks();
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
                    $scope.getWebhooks();
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
                    $scope.getWebhooks();
                }
            }, function(){
            });
        };

        if($state.params.secret || $state.params.webhookUrl){
            $scope.openCreateWebhookModal('app/pages/webhooks/webhooksList/addWebhookModal/addWebhookModal.html','md');
        }
    }
})();
