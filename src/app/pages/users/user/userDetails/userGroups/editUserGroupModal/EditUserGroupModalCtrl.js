(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('EditUserGroupModalCtrl', EditUserGroupModalCtrl);

    function EditUserGroupModalCtrl($rootScope,$scope,$uibModalInstance,toastr,userGroup,uuid,
                                    $http,environmentConfig,localStorageManagement,errorHandler) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.uuid = uuid;
        vm.user = {};
        $scope.groupForReassigning = {};
        $scope.loadingGroups = true;

        vm.getUser = function(){
            if(vm.token) {
                $http.get(environmentConfig.API + '/admin/users/' + vm.uuid + '/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        vm.user = res.data.data;
                    }
                }).catch(function (error) {
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        vm.getUser();

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
                        res.data.data.results.forEach(function (group) {
                            if(group.name == userGroup.name){
                                $scope.groupForReassigning = group;
                            }
                        });
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

        $scope.deleteUserGroup = function () {
            $scope.loadingGroups = true;
            if(vm.user.groups[0] && vm.user.groups[0].name){
                $http.delete(environmentConfig.API + '/admin/users/' + vm.user.identifier + '/groups/' + vm.user.groups[0].name + '/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        vm.reassignUser();
                    }
                }).catch(function (error) {
                    $scope.loadingGroups = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            } else {
                vm.reassignUser();
            }
        };

        vm.reassignUser = function () {
            if(vm.token) {
                $http.post(environmentConfig.API + '/admin/users/' + vm.user.identifier + '/groups/', {group: $scope.groupForReassigning.name}, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingGroups = false;
                    if (res.status === 201) {
                        $rootScope.$broadcast('userGroupChanged','group changed');
                        toastr.success('User successfully reassigned');
                        $uibModalInstance.close(res.data);
                    }
                }).catch(function (error) {
                    $scope.loadingGroups = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };



    }
})();
