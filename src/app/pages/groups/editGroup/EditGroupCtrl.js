(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groups.editGroup')
        .controller('EditGroupCtrl', EditGroupCtrl);

    /** @ngInject */
    function EditGroupCtrl($scope,localStorageManagement,Rehive,$stateParams,$location,errorHandler,toastr) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        $scope.groupName = $stateParams.groupName;
        vm.updatedGroup = {};
        $scope.loadingGroup = true;
        vm.location = $location.path();
        vm.locationArray = vm.location.split('/');
        $scope.locationIndicator = vm.locationArray[vm.locationArray.length - 1];

        $scope.goToGroupView = function (path) {
            $location.path(path);
        };

        $scope.getGroup = function () {
            if(vm.token) {
                $scope.loadingGroup = true;
                Rehive.admin.groups.get({name: $scope.groupName}).then(function (res) {
                    $scope.editGroupObj = res;
                    $scope.editGroupObj.prevName = res.name;
                    vm.getGroupUsers($scope.editGroupObj);
                }, function (error) {
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                });
            }
        };
        $scope.getGroup();

        vm.getGroupUsers = function (group) {
            if(vm.token) {
                $scope.loadingGroup = true;
                Rehive.admin.users.overview.get({filters: {
                    group: group.name
                }}).then(function (res) {
                    $scope.totalUsersCount = res.total;
                    $scope.deactiveUsersCount = res.archived;
                    $scope.loadingGroup = false;
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingGroup = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        $scope.groupChanged = function(field){
            if(field == 'name' && $scope.editGroupObj.name){
                $scope.editGroupObj.name = $scope.editGroupObj.name.toLowerCase();
            }

            if(field == 'default' && $scope.editGroupObj.default){
                $scope.editGroupObj['public'] = true;
                vm.updatedGroup['public'] = $scope.editGroupObj['public'];
            } else if(field == 'public' && !$scope.editGroupObj.public){
                $scope.editGroupObj['default'] = false;
                vm.updatedGroup['default'] = $scope.editGroupObj['default'];
            }

            vm.updatedGroup[field] = $scope.editGroupObj[field];
        };

        $scope.updateGroupObj = function (editGroupObj) {
            if(vm.token) {
                $scope.loadingGroup = true;
                Rehive.admin.groups.update(editGroupObj.prevName,vm.updatedGroup).then(function (res) {
                    if(editGroupObj.prevName == editGroupObj.name){
                        $scope.loadingGroup = false;
                        toastr.success('Group successfully edited');
                        $scope.getGroup();
                    } else {
                        $location.path('/groups/' + res.name + '/details');
                        toastr.success('Group successfully edited');
                    }
                    $scope.$apply();
                }, function (err) {
                    $scope.loadingGroup = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };



    }
})();
