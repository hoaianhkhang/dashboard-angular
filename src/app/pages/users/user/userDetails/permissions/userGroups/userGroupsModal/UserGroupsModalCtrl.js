(function () {
    'use strict';

    angular.module('BlurAdmin.pages.permissions.groups')
        .controller('UserGroupsModalCtrl', UserGroupsModalCtrl);

    function UserGroupsModalCtrl($scope,$uibModalInstance,userGroup,uuid,toastr,$http,environmentConfig,cookieManagement,errorHandler) {

        var vm = this;

        $scope.userGroup = userGroup;
        vm.uuid = uuid;
        $scope.deletingUserGroup = false;
        vm.token = cookieManagement.getCookie('TOKEN');

        $scope.deleteUserGroup = function () {
            $scope.deletingUserGroup = true;
            $http.delete(environmentConfig.API + '/admin/users/' + vm.uuid + '/groups/' + $scope.userGroup.name + '/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.deletingUserGroup = false;
                if (res.status === 200) {
                    toastr.success('Group successfully deleted');
                    $uibModalInstance.close($scope.userGroup);
                }
            }).catch(function (error) {
                $scope.deletingUserGroup = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };



    }
})();
