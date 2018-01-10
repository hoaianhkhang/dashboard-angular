(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('UserSettingsCtrl', UserSettingsCtrl);

    /** @ngInject */
    function UserSettingsCtrl($scope,environmentConfig,$stateParams,$http,cookieManagement,$uibModal,errorHandler,toastr,$filter) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
        vm.uuid = $stateParams.uuid;
        $scope.userSettingsObj = {};
        $scope.loadingUserSettings = true;

        vm.getUserSettings = function () {
            if(vm.token) {
                $scope.loadingUserSettings = true;
                $http.get(environmentConfig.API + '/admin/users/' + vm.uuid + '/settings', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingUserSettings = false;
                    if (res.status === 200) {
                        $scope.userSettingsObj = res.data.data;
                    }
                }).catch(function (error) {
                    $scope.loadingUserSettings = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        vm.getUserSettings();

        $scope.toggleUserSettings = function (groupSetting,type) {

            var updatedSetting = {};
            updatedSetting[type] = !groupSetting;

            if(vm.token) {
                $http.patch(environmentConfig.API + '/admin/users/' + vm.uuid + '/settings',updatedSetting, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $scope.userSettingsObj = {};
                        $scope.userSettingsObj = res.data.data;
                    }
                }).catch(function (error) {
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };



    }
})();
