(function () {
    'use strict';

    angular.module('BlurAdmin.theme.components')
        .controller('DashboardTasksModalCtrl', DashboardTasksModalCtrl);

    /** @ngInject */
    function DashboardTasksModalCtrl($rootScope,$scope,$http,environmentConfig,localStorageManagement,
                                     serializeFiltersService,errorHandler,$location,toastr) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        $scope.loadingTransactionSets = false;

        $scope.pagination = {
            itemsPerPage: 10,
            pageNo: 1,
            maxSize: 5
        };

        $scope.getTransactionSetsUrl = function(){

            var searchObj = {
                page: $scope.pagination.pageNo,
                page_size: $scope.pagination.itemsPerPage
            };

            return environmentConfig.API + '/admin/transactions/sets/?' + serializeFiltersService.serializeFilters(searchObj);
        };

        $scope.getTransactionSetsList = function(){
            if(vm.token) {
                $scope.loadingTransactionSets = true;

                var transactionSetsUrl = $scope.getTransactionSetsUrl();

                $http.get(transactionSetsUrl, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $scope.loadingTransactionSets = false;
                        $scope.dashboardTasksData = res.data.data;
                        $scope.dashboardTasksLists = $scope.dashboardTasksData.results;
                    }
                }).catch(function (error) {
                    $scope.loadingTransactionSets = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        $scope.getTransactionSetsList();

    }
})();
