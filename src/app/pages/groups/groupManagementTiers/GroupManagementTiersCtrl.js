(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groups.groupManagementTiers')
        .controller('GroupManagementTiersCtrl', GroupManagementTiersCtrl);

    /** @ngInject */
    function GroupManagementTiersCtrl($scope,$http,environmentConfig,localStorageManagement,
                                          $stateParams,$location,errorHandler) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.groupName = $stateParams.groupName;
        vm.updatedGroup = {};
        $scope.loadingGroup = true;
        vm.location = $location.path();
        vm.locationArray = vm.location.split('/');
        $scope.locationIndicator = vm.locationArray[vm.locationArray.length - 1];
        $scope.subMenuLocation = $scope.locationIndicator;
        $scope.locationIndicator = 'tiers';

        $scope.goToGroupView = function (path) {
            $location.path(path);
        };

        $scope.goToGroupManagementTiersSettings = function (path) {
            $scope.subMenuLocation = path;
            $location.path('/groups/' + vm.groupName + '/tiers/' + path);
        };

        if($scope.subMenuLocation != 'limits' && $scope.subMenuLocation != 'fees' && $scope.subMenuLocation != 'settings'
            && $scope.subMenuLocation != 'requirements' && $scope.subMenuLocation != 'list'){
            $scope.goToGroupManagementTiersSettings('list');
        }

        $scope.getGroup = function () {
            if(vm.token) {
                $scope.loadingGroup = true;

                $http.get(environmentConfig.API + '/admin/groups/' + vm.groupName + '/', {
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
                $http.get(environmentConfig.API + '/admin/users/overview?group=' + group.name, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $scope.totalUsersCount = res.data.data.total;
                        $scope.activeUsersCount = res.data.data.active;
                        $scope.loadingGroup = false;
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
