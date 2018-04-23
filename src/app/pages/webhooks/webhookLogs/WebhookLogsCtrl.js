(function () {
    'use strict';

    angular.module('BlurAdmin.pages.webhooks.logs')
        .controller('WebhookLogsCtrl', WebhookLogsCtrl);

    /** @ngInject */
    function WebhookLogsCtrl($scope,environmentConfig,$http,localStorageManagement,serializeFiltersService,errorHandler,$window,$location) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        $scope.loadingWebhooks = true;

        $scope.pagination = {
            itemsPerPage: 26,
            pageNo: 1,
            maxSize: 5
        };

        vm.getWebhookTasksUrl = function(){

            var searchObj = {
                page: $scope.pagination.pageNo,
                page_size: $scope.pagination.itemsPerPage || 1
            };

            return environmentConfig.API + '/admin/webhook-tasks/?' + serializeFiltersService.serializeFilters(searchObj);
        };

        $scope.getWebhookTasks = function () {
            if(vm.token) {
                $scope.loadingWebhooks = true;

                var webhookTasksUrl = vm.getWebhookTasksUrl();

                $http.get(webhookTasksUrl, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingWebhooks = false;
                    if (res.status === 200) {
                        $scope.webhookTasksData = res.data.data;
                        $scope.webhookTasks = res.data.data.results;
                        $window.scrollTo(0, 0);
                    }
                }).catch(function (error) {
                    $scope.loadingWebhooks = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        $scope.getWebhookTasks();

        $scope.goToLog = function (log) {
            $location.path('webhooks/logs/' + log.id);
        };




    }
})();
