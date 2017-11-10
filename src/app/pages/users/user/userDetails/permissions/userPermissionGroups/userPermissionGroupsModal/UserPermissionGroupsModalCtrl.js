(function () {
    'use strict';

    angular.module('BlurAdmin.pages.permissions.permissionGroups')
        .controller('UserPermissionGroupsModalCtrl', UserPermissionGroupsModalCtrl);

    function UserPermissionGroupsModalCtrl($scope,$uibModalInstance,userPermissionGroup,uuid,toastr,$http,environmentConfig,cookieManagement,errorHandler) {

        var vm = this;

        $scope.userPermissionGroup = userPermissionGroup;
        vm.uuid = uuid;
        $scope.deletingUserPermissionGroup = false;
        vm.token = cookieManagement.getCookie('TOKEN');

        $scope.deleteUserPermissionGroup = function () {
            $scope.deletingUserPermissionGroup = true;
            $http.delete(environmentConfig.API + '/admin/users/' + vm.uuid + '/permission-groups/' + $scope.userPermissionGroup.name + '/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.deletingUserPermissionGroup = false;
                if (res.status === 200) {
                    toastr.success('User permission group successfully deleted');
                    $uibModalInstance.close($scope.userPermissionGroup);
                }
            }).catch(function (error) {
                $scope.deletingUserPermissionGroup = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };



    }
})();
