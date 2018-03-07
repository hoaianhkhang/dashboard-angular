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
            $scope.loadingGroup = true;
            if($scope.user.groups[0] && $scope.user.groups[0].name){
                $http.delete(environmentConfig.API + '/admin/users/' + $scope.user.identifier + '/groups/' + $scope.user.groups[0].name + '/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        vm.reassignUser();
                    }
                }).catch(function (error) {
                    $scope.loadingGroup = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            } else {
                vm.reassignUser();
            }
        };

        vm.reassignUser = function () {

        };


    }
})();
