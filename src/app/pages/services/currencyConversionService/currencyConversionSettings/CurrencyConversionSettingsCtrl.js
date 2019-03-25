(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.currencyConversionService.currencyConversionSettings')
        .controller('CurrencyConversionSettingsCtrl', CurrencyConversionSettingsCtrl);

    /** @ngInject */
    function CurrencyConversionSettingsCtrl($rootScope,$scope,localStorageManagement,$http,$ngConfirm,environmentConfig,
                                        $timeout,toastr,$location,errorHandler) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        // vm.serviceId = localStorageManagement.getValue('SERVICEID');
        vm.serviceId = 9;
        // $rootScope.dashboardTitle = 'Currency conversion service | Rehive';
        $rootScope.dashboardTitle = 'Currency conversion extension | Rehive';
        $scope.currencyConversionSettingView = '';
        $scope.deactivatingCurrencyConversion = false;

        $scope.goToCurrencyConversionSetting = function (setting) {
            $scope.currencyConversionSettingView = setting;
        };
        $scope.goToCurrencyConversionSetting('deactivation');

        $scope.deactivateCurrencyConversionServiceConfirm = function () {
            $ngConfirm({
                // title: 'Deactivate service',
                title: 'Deactivate extension',
                contentUrl: 'app/pages/services/currencyConversionService/currencyConversionSettings/' +
                'currencyConversionDeactivation/currencyConversionDeactivationPrompt.html',
                animationBounce: 1,
                animationSpeed: 100,
                scope: $scope,
                buttons: {
                    Add: {
                        text: "Deactivate",
                        btnClass: 'btn-default dashboard-btn',
                        keys: ['enter'], // will trigger when enter is pressed
                        action: function(scope){
                            scope.deactivateCurrencyConversionService(scope.password);
                        }
                    },
                    close: {
                        text: "Cancel",
                        btnClass: 'btn-primary dashboard-btn'
                    }
                }
            });
        };

        $scope.deactivateCurrencyConversionService = function (password) {
            if(vm.token) {
                $scope.deactivatingCurrencyConversion = true;
                $http.put(environmentConfig.API + '/admin/services/' + vm.serviceId + '/',{password: password,active: false}, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $timeout(function () {
                            $scope.deactivatingCurrencyConversion = false;
                            toastr.success('Extension has been successfully deactivated');
                            // $location.path('/services');
                            $location.path('/extensions');
                        },600);
                    }
                }).catch(function (error) {
                    $scope.deactivatingCurrencyConversion = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

    }
})();
