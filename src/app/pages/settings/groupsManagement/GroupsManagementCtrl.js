(function () {
    'use strict';

    angular.module('BlurAdmin.pages.settings.groupsManagement')
        .controller('GroupsManagementCtrl', GroupsManagementCtrl);

    /** @ngInject */
    function GroupsManagementCtrl($scope,environmentConfig,$http,cookieManagement,errorHandler,toastr,$uibModal,$location) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
        $scope.loadingGroups = true;
        $scope.groupsParams = {};

        $scope.goToGroup = function(groupName){
            $location.path('/settings/groups-management/' + groupName + '/details');
        };

        vm.getGroups = function () {
            if(vm.token) {
                $scope.loadingGroups = true;
                $http.get(environmentConfig.API + '/admin/groups/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingGroups = false;
                    if (res.status === 200) {
                        $scope.groups = res.data.data.results;
                    }
                }).catch(function (error) {
                    $scope.loadingGroups = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        vm.getGroups();

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
                        vm.getGroups();
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
                    vm.getGroups();
                }
            }, function(){
            });
        };


    }
})();
