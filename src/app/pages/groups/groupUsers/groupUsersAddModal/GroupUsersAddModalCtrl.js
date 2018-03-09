(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groups.groupUsers')
        .controller('GroupUsersAddModalCtrl', GroupUsersAddModalCtrl);

    function GroupUsersAddModalCtrl($scope,$uibModalInstance,toastr,group,$http,typeaheadService,
                                    environmentConfig,cookieManagement,errorHandler) {

        var vm = this;
        vm.group = group;
        vm.token = cookieManagement.getCookie('TOKEN');
        $scope.getUsersEmailTypeahead = typeaheadService.getUsersEmailTypeahead();
        $scope.userGroupParams = {};
        $scope.loadingGroup = false;

        $scope.getUser = function(userGroupParams){
            if(vm.token) {
                $scope.loadingGroup = true;
                $http.get(environmentConfig.API + '/admin/users/?email__contains=' + encodeURIComponent(userGroupParams.email), {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $scope.user = res.data.data.results[0];
                        $scope.deleteUserGroup();
                    }
                }).catch(function (error) {
                    $scope.loadingGroup = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

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
                        vm.addUserToGroup();
                    }
                }).catch(function (error) {
                    $scope.loadingGroup = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            } else {
                vm.addUserToGroup();
            }
        };

        vm.addUserToGroup = function(){
            if(vm.token) {
                $http.post(environmentConfig.API + '/admin/users/' + $scope.user.identifier + '/groups/', {group: vm.group.name}, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingGroup = false;
                    if (res.status === 201) {
                        toastr.success('Group successfully added');
                        $uibModalInstance.close(res.data);
                    }
                }).catch(function (error) {
                    $scope.loadingGroup = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };



    }
})();
