(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groups.groupUsers')
        .controller('GroupUsersAddModalCtrl', GroupUsersAddModalCtrl);

    function GroupUsersAddModalCtrl($scope,$uibModalInstance,toastr,group,Rehive,
                                    localStorageManagement,errorHandler) {

        var vm = this;
        vm.group = group;
        vm.token = localStorageManagement.getValue('token');
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
                vm.filterObj = {};

                if(userGroupParams.inputType == 'Email'){
                    vm.filter = 'email__contains';
                    vm.filterString = userGroupParams.user;
                } else if(userGroupParams.inputType == 'Mobile'){
                    vm.filter = 'mobile__contains';
                    vm.filterString = userGroupParams.user;
                } else {
                    vm.filter = 'identifier__contains';
                    vm.filterString = userGroupParams.user;
                }

                vm.filterObj[vm.filter] = vm.filterString;

                Rehive.admin.users.get({filters: vm.filterObj}).then(function (res) {
                    if(res.results.length == 0){
                        toastr.error('No user found');
                        $scope.loadingGroup = false;
                    } else {
                        $scope.user = res.results[0];
                        $scope.deleteUserGroup();
                    }
                }, function (error) {
                    $scope.loadingGroup = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        $scope.deleteUserGroup = function () {
            $scope.loadingGroup = true;
            if($scope.user.groups[0] && $scope.user.groups[0].name){
                Rehive.admin.users.groups.delete($scope.user.identifier ,$scope.user.groups[0].name).then(function (res) {
                    vm.addUserToGroup();
                }, function (error) {
                    $scope.loadingGroup = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            } else {
                vm.addUserToGroup();
            }
        };

        vm.addUserToGroup = function(){
            if(vm.token) {
                Rehive.admin.users.groups.create($scope.user.identifier, {
                    group: vm.group.name
                }).then(function (res) {
                    $scope.loadingGroup = false;
                    toastr.success('Group successfully added');
                    $uibModalInstance.close(res);
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingGroup = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };



    }
})();
