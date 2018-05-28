(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groups.groupTransactionSettings')
        .controller('GroupTransactionSettingsCtrl', GroupTransactionSettingsCtrl);

    /** @ngInject */
    function GroupTransactionSettingsCtrl($scope,toastr,localStorageManagement,
                                          Rehive,$stateParams,$location,errorHandler) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.groupName = $stateParams.groupName;
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
                Rehive.admin.groups.get({name: vm.groupName}).then(function (res) {
                    $scope.editGroupObj = res;
                    $scope.editGroupObj.prevName = res.name;
                    vm.getGroupUsers($scope.editGroupObj);
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingGroup = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
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
                    $scope.activeUsersCount = res.active;
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

        vm.getGroupSettings = function () {
            if(vm.token) {
                $scope.loadingGroupSettings = true;
                Rehive.admin.groups.settings.get(vm.groupName).then(function (res) {
                    $scope.loadingGroupSettings = false;
                    $scope.groupSettingsObj = res;
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingGroupSettings = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.getGroupSettings();

        $scope.toggleGroupSettings = function (groupSetting,type) {

            var updatedSetting = {};
            updatedSetting[type] = !groupSetting;

            if(vm.token) {
                Rehive.admin.groups.settings.update(vm.groupName,updatedSetting).then(function (res) {
                    $scope.groupSettingsObj = {};
                    $scope.groupSettingsObj = res;
                    toastr.success('Group setting updated successfully');
                    $scope.$apply();
                }, function (error) {
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };



    }
})();
