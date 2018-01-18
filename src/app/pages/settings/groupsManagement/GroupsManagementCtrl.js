(function () {
    'use strict';

    angular.module('BlurAdmin.pages.settings.groupsManagement')
        .controller('GroupsManagementCtrl', GroupsManagementCtrl);

    /** @ngInject */
    function GroupsManagementCtrl($scope,environmentConfig,$http,cookieManagement,
                                  serializeFiltersService,errorHandler,toastr,$uibModal,$location) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
        $scope.loadingGroups = true;
        $scope.groupsParams = {};
        $scope.groups = [];

        $scope.pagination = {
            itemsPerPage: 8,
            pageNo: 1,
            maxSize: 5
        };

        $scope.goToGroup = function(groupName){
            $location.path('/settings/groups-management/' + groupName + '/details');
        };

        vm.getGroupsUrl = function(){

            var searchObj = {
                page: $scope.pagination.pageNo,
                page_size: $scope.pagination.itemsPerPage
            };

            return environmentConfig.API + '/admin/groups/?' + serializeFiltersService.serializeFilters(searchObj);
        };


        $scope.getGroups = function (fromModalDelete) {
            if(vm.token) {
                $scope.loadingGroups = true;

                if ($scope.groups.length > 0) {
                    $scope.groups.length = 0;
                }

                if(fromModalDelete){
                    $scope.pagination.pageNo = 1;
                }

                var groupsUrl = vm.getGroupsUrl();


                $http.get(groupsUrl, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingGroups = false;
                    if (res.status === 200) {
                        $scope.groupsData = res.data.data;
                        $scope.groups = res.data.data.results;
                    }
                }).catch(function (error) {
                    $scope.loadingGroups = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        $scope.getGroups();

        $scope.addGroup = function (groupsParams) {
            if(vm.token) {
                $scope.loadingGroups = true;
                $http.post(environmentConfig.API + '/admin/groups/', groupsParams, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingGroups = false;
                    if (res.status === 201) {
                        $scope.groupsParams = {};
                        toastr.success('Group successfully added');
                        $scope.getGroups();
                    }
                }).catch(function (error) {
                    $scope.groupsParams = {};
                    $scope.loadingGroups = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.openGroupManagementModal = function (page, size,group) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'GroupsManagementModalCtrl',
                resolve: {
                    group: function () {
                        return group;
                    }
                }
            });

            vm.theModal.result.then(function(group){
                if(group){
                    $scope.getGroups('fromModalDelete');
                }
            }, function(){
            });
        };


    }
})();
