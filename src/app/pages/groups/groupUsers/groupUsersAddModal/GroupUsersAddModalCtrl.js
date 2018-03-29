(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groups.groupUsers')
        .controller('GroupUsersAddModalCtrl', GroupUsersAddModalCtrl);

    function GroupUsersAddModalCtrl($scope,$uibModalInstance,toastr,group,$http,typeaheadService,
                                    environmentConfig,cookieManagement,errorHandler) {

        var vm = this;
        vm.group = group;
        vm.token = cookieManagement.getCookie('TOKEN');
        $scope.userGroupParams = {
            inputType: 'Email'
        };
        $scope.loadingGroup = false;
        $scope.userOptions = ['Email','Mobile','Identifier'];

        $scope.getUser = function(userGroupParams){
            if(vm.token) {
                $scope.loadingGroup = true;
                vm.filter = '';
                vm.filterString = '';

                if(userGroupParams.inputType == 'Email'){
                    vm.filter = 'email__contains=';
                    vm.filterString = encodeURIComponent(userGroupParams.user);
                } else if(userGroupParams.inputType == 'Mobile'){
                    vm.filter = 'mobile_number__contains=';
                    vm.filterString = encodeURIComponent(userGroupParams.user);
                } else {
                    vm.filter = 'identifier__contains=';
                    vm.filterString = userGroupParams.user;
                }

                $http.get(environmentConfig.API + '/admin/users/?' + vm.filter + vm.filterString, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        if(res.data.data.results.length == 0){
                            toastr.error('No user found');
                            $scope.loadingGroup = false;
                        } else {
                            $scope.user = res.data.data.results[0];
                            $scope.deleteUserGroup();
                        }
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
