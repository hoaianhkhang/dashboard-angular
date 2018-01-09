(function () {
    'use strict';

    angular.module('BlurAdmin.pages.group.settings')
        .controller('GroupSettingsCtrl', GroupSettingsCtrl);

    /** @ngInject */
    function GroupSettingsCtrl($scope,environmentConfig,$http,$stateParams,cookieManagement,errorHandler,$location) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
        vm.groupName = $stateParams.groupName;
        $scope.groupSettingsObj = {};
        $scope.loadingGroupSettings = true;

        vm.getGroupSettings = function () {
            if(vm.token) {
                $scope.loadingGroupSettings = true;
                $http.get(environmentConfig.API + '/admin/groups/' + vm.groupName + '/settings/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingGroupSettings = false;
                    if (res.status === 200) {
                        $scope.groupSettingsObj = res.data.data;
                    }
                }).catch(function (error) {
                    $scope.loadingGroupSettings = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        vm.getGroupSettings();

        $scope.toggleGroupSettings = function (groupSetting,type) {

            var updatedSetting = {};
            updatedSetting[type] = !groupSetting;

            if(vm.token) {
                $http.patch(environmentConfig.API + '/admin/groups/' + vm.groupName + '/settings/',updatedSetting, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $scope.groupSettingsObj = {};
                        $scope.groupSettingsObj = res.data.data;
                    }
                }).catch(function (error) {
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

    }
})();
