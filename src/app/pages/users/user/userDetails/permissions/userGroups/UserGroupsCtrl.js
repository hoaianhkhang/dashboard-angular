(function () {
    'use strict';

    angular.module('BlurAdmin.pages.permissions.groups')
        .controller('UserGroupsCtrl', UserGroupsCtrl);

    /** @ngInject */
    function UserGroupsCtrl($scope,environmentConfig,$stateParams,$http,$window,
                                 cookieManagement,errorHandler,toastr,$uibModal) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
        vm.uuid = $stateParams.uuid;
        $scope.userData = JSON.parse($window.sessionStorage.userData);
        $scope.loadingUserGroups = true;
        $scope.addingUserGroup = false;
        $scope.userGroupParams = {};
        $scope.userGroups = [];
        $scope.Groups = [];

        $scope.toggleAddUserGroupView  = function () {
            $scope.addingUserGroup = !$scope.addingUserGroup;
        };

        $scope.addUserGroup = function(userGroupParams){
            if(vm.token) {
                $scope.loadingUserGroups = true;
                $http.post(environmentConfig.API + '/admin/users/' + vm.uuid + '/groups/', {group: userGroupParams.name}, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingUserGroups = false;
                    if (res.status === 201) {
                        toastr.success('Group successfully added');
                        vm.getUserGroups();
                        $scope.toggleAddUserGroupView();
                    }
                }).catch(function (error) {
                    $scope.loadingUserGroups = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.getGroups = function () {
            if(vm.token) {
                $scope.loadingUserGroups = true;
                $http.get(environmentConfig.API + '/admin/groups/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $scope.groups = res.data.data.results;
                        if(res.data.data.results.length > 0){
                            $scope.userGroupParams = res.data.data.results[0];
                        }
                    }
                }).catch(function (error) {
                    $scope.loadingUserGroups = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        vm.getGroups();

        vm.getUserGroups = function () {
            if(vm.token) {
                $scope.loadingUserGroups = true;
                $http.get(environmentConfig.API + '/admin/users/' + vm.uuid + '/groups/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingUserGroups = false;
                    if (res.status === 200) {
                        $scope.userGroups = res.data.data.results;
                    }
                }).catch(function (error) {
                    $scope.loadingUserGroups = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        vm.getUserGroups();


        $scope.openUserGroupModal = function (page, size, userGroup) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'UserGroupsModalCtrl',
                scope: $scope,
                resolve: {
                    userGroup: function () {
                        return userGroup;
                    },
                    uuid: function () {
                        return vm.uuid;
                    }
                }
            });

            vm.theModal.result.then(function(userGroup){
                if(userGroup){
                    vm.getUserGroups();
                }
            }, function(){
            });
        };


    }
})();
