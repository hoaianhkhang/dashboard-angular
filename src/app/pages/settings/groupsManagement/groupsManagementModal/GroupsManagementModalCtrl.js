(function () {
    'use strict';

    angular.module('BlurAdmin.pages.settings.groupsManagement')
        .controller('GroupsManagementModalCtrl', GroupsManagementModalCtrl);

    function GroupsManagementModalCtrl($scope,group,$uibModalInstance,cookieManagement,environmentConfig,toastr,errorHandler,$http) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
        $scope.deletingGroups = false;
        $scope.group = group;

        $scope.deleteGroup = function () {
            if(vm.token) {
                $scope.deletingGroups = true;
                $http.delete(environmentConfig.API + '/admin/groups/' + group.name + '/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.deletingGroups = false;
                    if (res.status === 200) {
                        toastr.success('Group successfully deleted');
                        $uibModalInstance.close($scope.group);
                    }
                }).catch(function (error) {
                    $scope.deletingGroups = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
    }

})();
