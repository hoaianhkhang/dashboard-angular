(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groups.editGroup')
        .controller('EditGroupCtrl', EditGroupCtrl);

    /** @ngInject */
    function EditGroupCtrl($scope,$http,environmentConfig,cookieManagement,$stateParams,$location,errorHandler,toastr) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
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

                $http.get(environmentConfig.API + '/admin/groups/' + $scope.groupName + '/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $scope.editGroupObj = res.data.data;
                        $scope.editGroupObj.prevName = res.data.data.name;
                        vm.getGroupUsers($scope.editGroupObj);
                    }
                }).catch(function (error) {

                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        $scope.getGroup();

        vm.getGroupUsers = function (group) {
            if(vm.token) {
                $scope.loadingGroup = true;
                $http.get(environmentConfig.API + '/admin/users/?group=' + group.name, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $scope.totalUsersCount = res.data.data.count;
                        $scope.loadingGroup = false;
                    }
                }).catch(function (error) {
                    $scope.loadingGroup = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.groupChanged = function(field){
            if(field == 'name' && $scope.editGroupObj.name){
                $scope.editGroupObj.name = $scope.editGroupObj.name.toLowerCase();
            }

            vm.updatedGroup[field] = $scope.editGroupObj[field];
        };

        $scope.updateGroupObj = function (editGroupObj) {
            if(vm.token) {
                $scope.loadingGroup = true;
                $http.patch(environmentConfig.API + '/admin/groups/' + editGroupObj.prevName + '/',vm.updatedGroup, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        if(editGroupObj.prevName == editGroupObj.name){
                            $scope.loadingGroup = false;
                            toastr.success('Group successfully edited');
                            $scope.getGroup();
                        } else {
                            $location.path('/groups/' + res.data.data.name + '/details');
                            toastr.success('Group successfully edited');
                        }
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
