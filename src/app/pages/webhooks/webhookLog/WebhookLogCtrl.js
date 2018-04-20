(function () {
    'use strict';

    angular.module('BlurAdmin.pages.webhooks.log')
        .controller('WebhookLogCtrl', WebhookLogCtrl);

    /** @ngInject */
    function WebhookLogCtrl($scope,environmentConfig,$http,localStorageManagement,errorHandler,
                            $window,$stateParams,serializeFiltersService) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.logId = $stateParams.id;
        $scope.loadingWebhooks = true;
        $scope.loadingRequests = false;

        $scope.pagination = {
            itemsPerPage: 16,
            pageNo: 1,
            maxSize: 5
        };

        vm.getWebhookTask = function () {
            if(vm.token) {
                $scope.loadingWebhooks = true;
                $http.get(environmentConfig.API + '/admin/webhook-tasks/' + vm.logId + '/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingWebhooks = false;
                    if (res.status === 200) {
                        $scope.webhookTask = res.data.data;
                        $scope.mainData = JSON.stringify($scope.webhookTask.data,null,4);
                        $window.scrollTo(0,0);
                    }
                }).catch(function (error) {
                    $scope.loadingWebhooks = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        vm.getWebhookTask();

        vm.getWebhookRequestsUrl = function(){

            var searchObj = {
                page: $scope.pagination.pageNo,
                page_size: $scope.pagination.itemsPerPage || 1
            };

            return environmentConfig.API + '/admin/webhook-tasks/' + vm.logId + '/requests/?' + serializeFiltersService.serializeFilters(searchObj);
        };

        $scope.getWebhookRequests = function () {
            if(vm.token) {
                $scope.loadingRequests = true;

                var webhookRequestsUrl = vm.getWebhookRequestsUrl();

                $http.get(webhookRequestsUrl, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingRequests = false;
                    if (res.status === 200) {
                        $scope.webhookRequestsData = res.data.data;
                        $scope.webhookRequests = res.data.data.results;
                        $window.scrollTo(0, 0);
                    }
                }).catch(function (error) {
                    $scope.loadingRequests = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        $scope.getWebhookRequests();


    }
})();
