(function () {
    'use strict';

    angular.module('BlurAdmin.pages.settings.requestLogs')
        .controller('RequestLogsCtrl', RequestLogsCtrl);

    /** @ngInject */
    function RequestLogsCtrl($scope,environmentConfig,$http,localStorageManagement,errorHandler,
                             typeaheadService,serializeFiltersService,$location) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        $scope.requestLogs = [];
        $scope.loadingRequestLogs = true;
        $scope.showingFilters = false;
        $scope.filtersCount = 0;

        $scope.showRequestLogsFilters = function () {
            $scope.showingFilters = !$scope.showingFilters;
        };

        $scope.getUsersEmailTypeahead = typeaheadService.getUsersEmailTypeahead();

        $scope.filtersObj = {
            userFilter: false,
            keyFilter: false,
            schemeFilter: false,
            pathFilter: false,
            methodFilter: false,
            contentTypeFilter: false,
            statusCodeFilter: false
        };
        $scope.applyFiltersObj = {
            userFilter: {
                selectedUserOption: null
            },
            keyFilter: {
                selectedKey: null
            },
            schemeFilter: {
                selectedScheme: null
            },
            pathFilter: {
                selectedPath: null
            },
            methodFilter: {
                selectedMethod: null
            },
            contentTypeFilter: {
                selectedContentType: null
            },
            statusCodeFilter: {
                selectedStatusCode: null
            }
        };

        $scope.pagination = {
            itemsPerPage: 25,
            pageNo: 1,
            maxSize: 5
        };

        vm.getRequestLogsUrl = function(){
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
                page_size: $scope.pagination.itemsPerPage || 1,
                user: $scope.filtersObj.userFilter ? ($scope.applyFiltersObj.userFilter.selectedUserOption ? encodeURIComponent($scope.applyFiltersObj.userFilter.selectedUserOption) : null): null,
                key: $scope.filtersObj.keyFilter ? ($scope.applyFiltersObj.keyFilter.selectedKey ? $scope.applyFiltersObj.keyFilter.selectedKey : null): null,
                path: $scope.filtersObj.pathFilter ? ($scope.applyFiltersObj.pathFilter.selectedPath ? $scope.applyFiltersObj.pathFilter.selectedPath : null): null,
                method: $scope.filtersObj.methodFilter ? ($scope.applyFiltersObj.methodFilter.selectedMethod ? $scope.applyFiltersObj.methodFilter.selectedMethod : null): null,
                content_type: $scope.filtersObj.contentTypeFilter ? ($scope.applyFiltersObj.contentTypeFilter.selectedContentType ? $scope.applyFiltersObj.contentTypeFilter.selectedContentType : null): null,
                status_code: $scope.filtersObj.statusCodeFilter ? ($scope.applyFiltersObj.statusCodeFilter.selectedStatusCode ? $scope.applyFiltersObj.statusCodeFilter.selectedStatusCode : null): null,
                orderby: '-created'
            };

            return environmentConfig.API + '/admin/requests/?' + serializeFiltersService.serializeFilters(searchObj);
        };

        $scope.getRequestLogs = function (applyFilter) {
            $scope.loadingRequestLogs = true;

            $scope.showingFilters = false;

            if (applyFilter) {
                // if function is called from history-filters directive, then pageNo set to 1
                $scope.pagination.pageNo = 1;
            }

            if ($scope.requestLogs.length > 0) {
                $scope.requestLogs.length = 0;
            }

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

        $scope.clearFilters = function () {
            $scope.filtersObj = {
                userFilter: false,
                keyFilter: false,
                schemeFilter: false,
                pathFilter: false,
                methodFilter: false,
                contentTypeFilter: false,
                statusCodeFilter: false
            };
        };

        $scope.goToRequestLog = function (log) {
            $location.path('/settings/request-log/' + log.id + '/');
        };

    }
})();
