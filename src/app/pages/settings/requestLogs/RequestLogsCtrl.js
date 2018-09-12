(function () {
    'use strict';

    angular.module('BlurAdmin.pages.settings.requestLogs')
        .controller('RequestLogsCtrl', RequestLogsCtrl);

    /** @ngInject */
    function RequestLogsCtrl($scope,Rehive,localStorageManagement,errorHandler,
                             typeaheadService,serializeFiltersService,$uibModal,$filter) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        vm.companyIdentifier = localStorageManagement.getValue('companyIdentifier');
        vm.savedRequestTableColumns = vm.companyIdentifier + 'requestTable';
        $scope.requestLogs = [];
        $scope.loadingRequestLogs = true;
        $scope.showingFilters = false;
        $scope.filtersCount = 0;
        $scope.showingColumnFilters = false;

        $scope.requestHeaderColumns = localStorageManagement.getValue(vm.savedRequestTableColumns) ? JSON.parse(localStorageManagement.getValue(vm.savedRequestTableColumns)) : [
            {colName: 'Id',fieldName: 'id',visible: true},
            {colName: 'User',fieldName: 'user',visible: false},
            {colName: 'Key',fieldName: 'key',visible: false},
            {colName: 'Scheme',fieldName: 'scheme',visible: false},
            {colName: 'Path',fieldName: 'path',visible: true},
            {colName: 'Method',fieldName: 'method',visible: true},
            {colName: 'Content type',fieldName: 'content_type',visible: false},
            {colName: 'Status code',fieldName: 'status_code',visible: true},
            {colName: 'Created',fieldName: 'createdDate',visible: true},
            {colName: 'Updated',fieldName: 'updatedDate',visible: false}
        ];

        $scope.selectAllColumns = function () {
            $scope.requestHeaderColumns.forEach(function (headerObj) {
                headerObj.visible = true;
            });
            localStorageManagement.setValue(vm.savedRequestTableColumns,JSON.stringify($scope.requestHeaderColumns));
        };

        $scope.toggleColumnVisibility = function () {
            localStorageManagement.setValue(vm.savedRequestTableColumns,JSON.stringify($scope.requestHeaderColumns));
        };

        $scope.restoreColDefaults = function () {
            var defaultVisibleHeader = ['Id','Path','Status code','Method','Created'];

            $scope.requestHeaderColumns.forEach(function (headerObj) {
                if(defaultVisibleHeader.indexOf(headerObj.colName) > -1){
                    headerObj.visible = true;
                } else {
                    headerObj.visible = false;
                }
            });

            localStorageManagement.setValue(vm.savedRequestTableColumns,JSON.stringify($scope.requestHeaderColumns));
        };

        $scope.showColumnFilters = function () {
            $scope.showingFilters = false;
            $scope.showingColumnFilters = !$scope.showingColumnFilters;
        };

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

        vm.getRequestLogsFiltersObj = function(){
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
                user: $scope.filtersObj.userFilter ? ($scope.applyFiltersObj.userFilter.selectedUserOption ? $scope.applyFiltersObj.userFilter.selectedUserOption : null): null,
                key: $scope.filtersObj.keyFilter ? ($scope.applyFiltersObj.keyFilter.selectedKey ? $scope.applyFiltersObj.keyFilter.selectedKey : null): null,
                path: $scope.filtersObj.pathFilter ? ($scope.applyFiltersObj.pathFilter.selectedPath ? $scope.applyFiltersObj.pathFilter.selectedPath : null): null,
                method: $scope.filtersObj.methodFilter ? ($scope.applyFiltersObj.methodFilter.selectedMethod ? $scope.applyFiltersObj.methodFilter.selectedMethod : null): null,
                content_type: $scope.filtersObj.contentTypeFilter ? ($scope.applyFiltersObj.contentTypeFilter.selectedContentType ? $scope.applyFiltersObj.contentTypeFilter.selectedContentType : null): null,
                status_code: $scope.filtersObj.statusCodeFilter ? ($scope.applyFiltersObj.statusCodeFilter.selectedStatusCode ? $scope.applyFiltersObj.statusCodeFilter.selectedStatusCode : null): null,
                orderby: '-created'
            };

            return serializeFiltersService.objectFilters(searchObj);
        };

        $scope.getRequestLogs = function (applyFilter) {
            if(vm.token) {
                $scope.loadingRequestLogs = true;

                $scope.showingFilters = false;

                if (applyFilter) {
                    // if function is called from history-filters directive, then pageNo set to 1
                    $scope.pagination.pageNo = 1;
                }

                if ($scope.requestLogs.length > 0) {
                    $scope.requestLogs.length = 0;
                }

                var requestLogsFiltersObj = vm.getRequestLogsFiltersObj();

                Rehive.admin.requests.get({filters: requestLogsFiltersObj}).then(function (res) {
                    $scope.requestLogsData = res;
                    vm.formatRequestLogsArray($scope.requestLogsData.results);
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingRequestLogs = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        $scope.getRequestLogs();

        vm.formatRequestLogsArray = function (requestLogsArray) {
            requestLogsArray.forEach(function (requestLogObj,index,array) {
                $scope.requestLogs.push({
                    id: requestLogObj.id,
                    user: requestLogObj.user.email || requestLogObj.user.mobile,
                    key: requestLogObj.key,
                    scheme: requestLogObj.scheme,
                    path: requestLogObj.path,
                    method: requestLogObj.method,
                    content_type: requestLogObj.content_type,
                    status_code: requestLogObj.status_code,
                    createdDate: $filter("date")(requestLogObj.created,'mediumDate') + ' ' + $filter("date")(requestLogObj.created,'shortTime'),
                    updatedDate: $filter("date")(requestLogObj.updated,'mediumDate') + ' ' + $filter("date")(requestLogObj.updated,'shortTime')
                });
            });
            
            $scope.loadingRequestLogs = false;
        };

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

        $scope.goToRequestLog = function (page,size,log) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'RequestLogModalCtrl',
                scope: $scope,
                resolve: {
                    log: function () {
                        return log;
                    }
                }
            });
        };

        $scope.closeColumnFiltersBox = function () {
            $scope.showingColumnFilters = false;
        };

    }
})();
