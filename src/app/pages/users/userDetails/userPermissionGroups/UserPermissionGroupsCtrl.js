(function () {
    'use strict';

    angular.module('BlurAdmin.pages.userDetails')
        .controller('UserPermissionGroupsCtrl', UserPermissionGroupsCtrl);

    /** @ngInject */
    function UserPermissionGroupsCtrl($scope,environmentConfig,$stateParams,$http,
                                 cookieManagement,errorToasts,toastr,$uibModal) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
        vm.uuid = $stateParams.uuid;
        $scope.loadingUserPermissionGroups = true;
        $scope.addingUserPermissionGroup = false;
        $scope.userPermissionGroupParams = {};
        $scope.userPermissionGroups = [];
        $scope.permissionGroups = [];

        $scope.toggleAddUserPermissionGroupView  = function () {
            $scope.addingUserPermissionGroup = !$scope.addingUserPermissionGroup;
        };

        $scope.addUserPermissionGroup = function(userPermissionGroupParams){
            if(vm.token) {
                $scope.loadingUserPermissionGroups = true;
                $http.post(environmentConfig.API + '/admin/users/' + vm.uuid + '/permission-groups/', {group: userPermissionGroupParams.name}, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingUserPermissionGroups = false;
                    if (res.status === 201) {
                        toastr.success('User permission group successfully added');
                        vm.getUserPermissionGroups();
                        $scope.toggleAddUserPermissionGroupView();
                    }
                }).catch(function (error) {
                    $scope.loadingUserPermissionGroups = false;
                    errorToasts.evaluateErrors(error.data);
                });
            }
        };

        vm.getPermissionGroups = function () {
            if(vm.token) {
                $scope.loadingUserPermissionGroups = true;
                $http.get(environmentConfig.API + '/admin/permission-groups/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        if(res.data.data.results.length > 0){
                            $scope.userPermissionGroupParams = res.data.data.results[0];
                            res.data.data.results.push({name: 'admin'});
                            $scope.permissionGroups = res.data.data.results;
                        }
                    }
                }).catch(function (error) {
                    $scope.loadingUserPermissionGroups = false;
                    errorToasts.evaluateErrors(error.data);
                });
            }
        };
        vm.getPermissionGroups();

        vm.getUserPermissionGroups = function () {
            if(vm.token) {
                $scope.loadingUserPermissionGroups = true;
                $http.get(environmentConfig.API + '/admin/users/' + vm.uuid + '/permission-groups/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingUserPermissionGroups = false;
                    if (res.status === 200) {
                        $scope.userPermissionGroups = res.data.data.results;
                    }
                }).catch(function (error) {
                    $scope.loadingUserPermissionGroups = false;
                    errorToasts.evaluateErrors(error.data);
                });
            }
        };
        vm.getUserPermissionGroups();


        $scope.openUserPermissionGroupModal = function (page, size, userPermissionGroup) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'UserPermissionGroupsModalCtrl',
                scope: $scope,
                resolve: {
                    userPermissionGroup: function () {
                        return userPermissionGroup;
                    },
                    uuid: function () {
                        return vm.uuid;
                    }
                }
            });

            vm.theModal.result.then(function(userPermissionGroup){
                if(userPermissionGroup){
                    vm.getUserPermissionGroups();
                }
            }, function(){
            });
        };


    }
})();
