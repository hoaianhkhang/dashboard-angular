(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groups.groupUsers')
        .controller('ReassignGroupUserModalCtrl', ReassignGroupUserModalCtrl);

    function ReassignGroupUserModalCtrl($scope,$uibModalInstance,toastr,user,Rehive,localStorageManagement,errorHandler) {

        var vm = this;
        vm.user = user;
        vm.token = localStorageManagement.getValue('token');
        $scope.groupForReassigning = {};
        $scope.groups = [];

        vm.getUser = function(){
            if(vm.token) {
                Rehive.admin.users.get({filters: {email__contains: vm.user.email}}).then(function (res) {
                    vm.user = res.results[0];
                    $scope.$apply();
                }, function (error) {
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.getUser();

        vm.getGroups = function () {
            if(vm.token) {
                $scope.loadingGroups = true;
                Rehive.admin.groups.get().then(function (res) {
                    $scope.loadingGroups = false;
                    $scope.groups = res.results;
                    if(res.results.length > 0){
                        $scope.groupForReassigning = res.results[0];
                    }
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingGroups = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.getGroups();

        $scope.deleteUserGroup = function () {
            $scope.loadingGroups = true;
            if(vm.user.groups[0] && vm.user.groups[0].name){
                Rehive.admin.users.groups.delete(vm.user.identifier,vm.user.groups[0].name).then(function (res) {
                    vm.reassignUser();
                }, function (error) {
                    $scope.loadingGroups = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            } else {
                vm.reassignUser();
            }
        };

        vm.reassignUser = function () {
            if(vm.token) {
                Rehive.admin.users.groups.create(vm.user.identifier, {
                    group: $scope.groupForReassigning.name
                }).then(function (res) {
                    $scope.loadingGroups = false;
                    toastr.success('User successfully reassigned');
                    $uibModalInstance.close(res);
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingGroups = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };


    }
})();
