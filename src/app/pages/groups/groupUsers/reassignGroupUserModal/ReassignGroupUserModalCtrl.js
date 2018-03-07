(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groupUsers')
        .controller('ReassignGroupUserModalCtrl', ReassignGroupUserModalCtrl);

    function ReassignGroupUserModalCtrl($scope,$uibModalInstance,toastr,user,$http,typeaheadService,
                                      environmentConfig,cookieManagement,errorHandler) {

        var vm = this;
        vm.user = user;
        vm.token = cookieManagement.getCookie('TOKEN');
        $scope.groupForReassigning = {};
        $scope.groups = [];

        vm.getUser = function(){
            if(vm.token) {
                $http.get(environmentConfig.API + '/admin/users/?email__contains=' + encodeURIComponent(vm.user.email), {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        vm.user = res.data.data.results[0];
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
                        $scope.groups = res.data.data.results;
                        if(res.data.data.results.length > 0){
                            $scope.groupForReassigning = res.data.data.results[0];
                        }
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
