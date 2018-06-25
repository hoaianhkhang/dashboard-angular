(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groups.overview')
        .controller('AddGroupsModalCtrl', AddGroupsModalCtrl);

    function AddGroupsModalCtrl($scope,$uibModalInstance,localStorageManagement,Rehive,$filter,errorHandler) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        $scope.addingGroups = false;
        $scope.groupsParams = {};

        $scope.groupNameToLowercase = function () {
            if($scope.groupsParams.name){
                $scope.groupsParams.name = $scope.groupsParams.name.toLowerCase();
                $scope.groupsParams.label = $filter('capitalizeWord')($scope.groupsParams.name);
            } else {
                $scope.groupsParams.label = '';
            }
        };

        $scope.addGroup = function (groupsParams) {
            if(vm.token) {
                $scope.addingGroups = true;
                Rehive.admin.groups.create(groupsParams).then(function (res) {
                    $scope.addingGroups = false;
                    $scope.groupsParams = {};
                    $uibModalInstance.close(res);
                    $scope.$apply();
                }, function (error) {
                    $scope.groupsParams = {};
                    $scope.addingGroups = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

    }
})();
