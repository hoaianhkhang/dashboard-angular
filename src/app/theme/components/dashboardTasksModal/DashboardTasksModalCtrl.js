(function () {
    'use strict';

    angular.module('BlurAdmin.theme.components')
        .controller('DashboardTasksModalCtrl', DashboardTasksModalCtrl);

    /** @ngInject */
    function DashboardTasksModalCtrl($rootScope,$scope,$http,environmentConfig,localStorageManagement,
                                     serializeFiltersService,errorHandler,$window,$timeout) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        $scope.loadingTransactionSets = false;
        $scope.inProgressSets = false;
        $scope.dashboardTasksLists = [];

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

        $scope.getTransactionSetsList = function(noLoadingImage){
            if(vm.token) {

                if(!noLoadingImage){
                    $scope.loadingTransactionSets = true;
                }

                $scope.inProgressSets = false;

                var transactionSetsUrl = $scope.getTransactionSetsUrl();

                $http.get(transactionSetsUrl, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        if(res.data.data.results.length > 0){
                            $scope.dashboardTasksData = res.data.data;
                            $scope.dashboardTasksLists = $scope.dashboardTasksData.results;
                            vm.getFinishedTransactionSets($scope.dashboardTasksLists);
                        } else {
                            $scope.loadingTransactionSets = false;
                        }
                    }
                }).catch(function (error) {
                    $scope.loadingTransactionSets = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        $scope.getTransactionSetsList();

        vm.getFinishedTransactionSets = function (setList) {
            setList.forEach(function (set,index,array) {
                if(index == (array.length - 1)){
                    if(set.progress == 100){
                        vm.getSingleTransactionSet(set,'last');
                    } else {
                        // scenario if array length is 1
                        $scope.inProgressSets = true;
                        vm.getSingleTransactionSet(null,'last');
                    }
                } else{
                    if(set.progress == 100){
                        vm.getSingleTransactionSet(set)
                    } else {
                        $scope.inProgressSets = true;
                        $scope.loadingTransactionSets = false;
                    }
                }
            })
        };

        vm.getSingleTransactionSet = function (set,last) {
            if(set){
                $http.get(environmentConfig.API + '/admin/transactions/sets/' + set.id + '/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        set.pages = res.data.data.pages;
                        if(last){
                            $scope.loadingTransactionSets = false;
                            if($scope.inProgressSets){
                                $rootScope.$broadcast('exportingSetsStatus', {status: 'inProgress'});
                                $timeout(function () {
                                    $scope.getTransactionSetsList('noLoadingImage');
                                },2000)
                            } else {
                                $rootScope.$broadcast('exportingSetsStatus', {status: 'Complete'});
                            }
                        }
                    }
                }).catch(function (error) {
                    $scope.loadingTransactionSets = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            } else {
                // scenario if array length is 1

                $scope.loadingTransactionSets = false;
                if($scope.inProgressSets){
                    $rootScope.$broadcast('exportingSetsStatus', {status: 'inProgress'});
                    $timeout(function () {
                        $scope.getTransactionSetsList('noLoadingImage');
                    },2000)
                } else {
                    $rootScope.$broadcast('exportingSetsStatus', {status: 'Complete'});
                }
            }
        };

        // $scope.$on('exportSetCreate', function(event, obj){
        //     if(obj.status == 'created'){
        //         $scope.getTransactionSetsList();
        //     }
        // });

        $scope.downloadExportFile = function (file) {
            $window.open(file,'_blank');
        };

    }
})();
