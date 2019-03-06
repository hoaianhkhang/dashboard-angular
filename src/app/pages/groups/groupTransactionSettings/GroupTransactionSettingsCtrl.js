(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groups.groupTransactionSettings')
        .controller('GroupTransactionSettingsCtrl', GroupTransactionSettingsCtrl);

    /** @ngInject */
    function GroupTransactionSettingsCtrl($scope,toastr,localStorageManagement,
                                          Rehive,$stateParams,$location,errorHandler) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        $scope.groupName = ($stateParams.groupName == 'service') ? 'extension' : $stateParams.groupName;
        vm.updatedGroup = {};
        $scope.loadingGroup = true;
        vm.location = $location.path();
        vm.locationArray = vm.location.split('/');
        $scope.locationIndicator = vm.locationArray[vm.locationArray.length - 1];

        $scope.goToGroupView = function (path) {
            $location.path(path);
        };

        $scope.getGroup = function () {
            var groupName = ($scope.groupName == 'extension') ? 'service' : $scope.groupName;
            if(vm.token) {
                $scope.loadingGroup = true;
                Rehive.admin.groups.get({name: groupName}).then(function (res) {
                    if(res.name === "service"){
                        res.name = "extension";
                    }
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
            var groupName = ($scope.groupName == 'extension') ? 'service' : $scope.groupName;
            if(vm.token) {
                $scope.loadingGroupSettings = true;
                Rehive.admin.groups.settings.get(groupName).then(function (res) {
                    $scope.loadingGroupSettings = false;
                    if(res.name === "service"){
                        res.name = "extension";
                    }
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
            var groupName = ($scope.groupName == 'extension') ? 'service' : $scope.groupName;
            if(vm.token) {
                Rehive.admin.groups.settings.update(groupName,updatedSetting).then(function (res) {
                    $scope.groupSettingsObj = {};
                    if(res.name === "service"){
                        res.name = "extension";
                    }
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
