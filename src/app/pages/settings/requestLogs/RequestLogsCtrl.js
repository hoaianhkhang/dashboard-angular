(function () {
    'use strict';

    angular.module('BlurAdmin.pages.settings.requestLogs')
        .controller('RequestLogsCtrl', RequestLogsCtrl);

    /** @ngInject */
    function RequestLogsCtrl($scope,environmentConfig,$http,localStorageManagement,errorHandler,serializeFiltersService,$location) {
        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        $scope.loadingRequestLogs = true;

        $scope.pagination = {
            itemsPerPage: 25,
            pageNo: 1,
            maxSize: 5
        };

        vm.getRequestLogsUrl = function(){
            var searchObj = {
                page: $scope.pagination.pageNo,
                page_size: $scope.pagination.itemsPerPage || 1,
                orderby: '-created'
            };

            return environmentConfig.API + '/admin/requests/?' + serializeFiltersService.serializeFilters(searchObj);
        };

        $scope.getRequestLogs = function () {
            $scope.loadingRequestLogs = true;

            var requestLogsUrl = vm.getRequestLogsUrl();

            if(vm.token) {
                $http.get(requestLogsUrl, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingRequestLogs = false;
                    if (res.status === 200) {
                        $scope.requestLogsData = res.data.data;
                        $scope.requestLogs = res.data.data.results;
                    }
                }).catch(function (error) {
                    $scope.loadingRequestLogs = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        $scope.getRequestLogs();

        $scope.goToRequestLog = function (log) {
            $location.path('/settings/request-log/' + log.id + '/');
        };

    }
})();
