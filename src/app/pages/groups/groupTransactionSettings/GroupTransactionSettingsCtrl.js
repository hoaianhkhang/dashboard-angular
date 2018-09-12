(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groups.groupTransactionSettings')
        .controller('GroupTransactionSettingsCtrl', GroupTransactionSettingsCtrl);

    /** @ngInject */
    function GroupTransactionSettingsCtrl($scope,toastr,localStorageManagement,
                                          Rehive,$stateParams,$location,errorHandler) {

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
        $scope.getGroup();

        vm.getGroupSettings = function () {
            if(vm.token) {
                $scope.loadingGroupSettings = true;
                Rehive.admin.groups.settings.get($scope.groupName).then(function (res) {
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
                Rehive.admin.groups.settings.update($scope.groupName,updatedSetting).then(function (res) {
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
