(function () {
    'use strict';

    angular.module('BlurAdmin.pages.webhooks.list')
        .controller('WebhooksListCtrl', WebhooksListCtrl);

    /** @ngInject */

    function WebhooksListCtrl($scope,Rehive,$uibModal,serializeFiltersService,
                              $location,localStorageManagement,errorHandler,$window,$state) {

        var vm = this;
        vm.updatedWebhook = {};
        vm.token = localStorageManagement.getValue('token');
        $scope.loadingWebhooks = true;
        $scope.filtersCount = 0;
        $scope.showingFilters = false;
        $scope.webhookList = [];

        var location = $location.path();
        var locationArray = location.split('/');
        $scope.locationIndicator = locationArray[(locationArray.length -1)];

        $scope.pagination = {
            itemsPerPage: 25,
            pageNo: 1,
            maxSize: 5
        };

        $scope.filtersObj = {
            secretFilter: false
        };
        $scope.applyFiltersObj = {
            secretFilter: {
                selectedSecretOption: ''
            }
        };

        $scope.clearFilters = function () {
            $scope.filtersObj = {
                secretFilter: false
            };
        };

        $scope.showFilters = function () {
            $scope.showingFilters = !$scope.showingFilters;
        };

        vm.getWebhooksFiltersObj = function(){
            $scope.filtersCount = 0;

            for(var x in $scope.filtersObj){
                if($scope.filtersObj.hasOwnProperty(x)){
                    if($scope.filtersObj[x]){
                        $scope.filtersCount = $scope.filtersCount + 1;
                    }
                }
            }

            var searchObj = {
                page: $scope.pagination.pageNo,
                page_size: $scope.pagination.itemsPerPage || 25,
                secret: $scope.filtersObj.secretFilter ? $scope.applyFiltersObj.secretFilter.selectedSecretOption : null
            };

            return serializeFiltersService.objectFilters(searchObj);
        };

        $scope.getWebhooks = function (applyFilter) {
            if(vm.token) {

                $scope.showingFilters = false;
                $scope.loadingWebhooks = true;

                if (applyFilter) {
                    // if function is called from history-filters directive, then pageNo set to 1
                    $scope.pagination.pageNo = 1;
                }

                if ($scope.webhookList.length > 0) {
                    $scope.webhookList.length = 0;
                }

                var webhooksFiltersObj = vm.getWebhooksFiltersObj();

                Rehive.admin.webhooks.get({filters: webhooksFiltersObj}).then(function (res) {
                    $scope.loadingWebhooks = false;
                    $scope.webhooksData = res;
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
