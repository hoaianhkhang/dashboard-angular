(function () {
    'use strict';

    angular.module('BlurAdmin.pages.accountSettings.accountCurrencySettings')
        .controller('AccountCurrencySettingsCtrl', AccountCurrencySettingsCtrl);

    /** @ngInject */
    function AccountCurrencySettingsCtrl($scope,$stateParams,$http,environmentConfig,
                                       cookieManagement,errorHandler) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
        vm.currencyCode = $stateParams.currencyCode;
        vm.reference = $stateParams.reference;

        $scope.accountCurrencySettingsObj = {};
        $scope.loadingAccountCurrencySettings = true;

        vm.getGroupSettings = function () {
            if(vm.token) {
                $scope.loadingAccountCurrencySettings = true;
                $http.get(environmentConfig.API + '/admin/accounts/' + vm.reference + '/currencies/' + vm.currencyCode + '/settings/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingAccountCurrencySettings = false;
                    if (res.status === 200) {
                        $scope.accountCurrencySettingsObj = res.data.data;
                    }
                }).catch(function (error) {
                    $scope.loadingAccountCurrencySettings = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        vm.getGroupSettings();

        $scope.toggleAccountCurrencySettings = function (groupSetting,type) {

            var updatedSetting = {};
            updatedSetting[type] = !groupSetting;

            if(vm.token) {
                $http.patch(environmentConfig.API + '/admin/accounts/' + vm.reference + '/currencies/' + vm.currencyCode + '/settings/',updatedSetting, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $scope.accountCurrencySettingsObj = {};
                        $scope.accountCurrencySettingsObj = res.data.data;
                    }
                }).catch(function (error) {
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };


    }
})();