(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('UserGroupsCtrl', UserGroupsCtrl);

    /** @ngInject */
    function UserGroupsCtrl($scope,environmentConfig,$stateParams,$http,$window,
                            localStorageManagement,errorHandler,toastr,$uibModal) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.uuid = $stateParams.uuid;
        $scope.userGroups = {};
        $scope.loadingUserGroup = true;

        vm.getUserGroups = function () {
            if(vm.token) {
                $scope.loadingUserGroup = true;
                $http.get(environmentConfig.API + '/admin/users/' + vm.uuid + '/groups/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingUserGroup = false;
                    if (res.status === 200) {
                        if(res.data.data.results.length > 0){
                            $scope.userGroups = res.data.data.results[0];
                        }
                    }
                }).catch(function (error) {
                    $scope.loadingUserGroup = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        vm.getUserGroups();


        $scope.openEditUserGroupModal = function (page, size, userGroup) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'EditUserGroupModalCtrl',
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
