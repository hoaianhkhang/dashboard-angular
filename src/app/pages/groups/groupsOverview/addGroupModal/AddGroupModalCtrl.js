(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groups.overview')
        .controller('AddGroupsModalCtrl', AddGroupsModalCtrl);

    function AddGroupsModalCtrl($scope,$uibModalInstance,cookieManagement,environmentConfig,toastr,errorHandler,$http) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
        $scope.addingGroups = false;
        $scope.groupsParams = {};

        $scope.groupNameToLowercase = function () {
            if($scope.groupsParams.name){
                $scope.groupsParams.name = $scope.groupsParams.name.toLowerCase();
            }
        };

        $scope.addGroup = function (groupsParams) {
            if(vm.token) {
                $scope.addingGroups = true;
                $http.post(environmentConfig.API + '/admin/groups/', groupsParams, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.addingGroups = false;
                    if (res.status === 201) {
                        $scope.groupsParams = {};
                        $uibModalInstance.close(res.data.data);
                    }
                }).catch(function (error) {
                    $scope.groupsParams = {};
                    $scope.addingGroups = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

    }
})();
