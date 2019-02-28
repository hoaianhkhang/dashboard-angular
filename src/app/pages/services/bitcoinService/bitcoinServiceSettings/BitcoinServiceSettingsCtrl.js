(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.bitcoinService.bitcoinServiceSettings')
        .controller('BitcoinServiceSettingsCtrl', BitcoinServiceSettingsCtrl);

    /** @ngInject */
    function BitcoinServiceSettingsCtrl($rootScope,$scope,localStorageManagement,$http,$ngConfirm,environmentConfig,
                                        $timeout,toastr,$location,errorHandler) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        // vm.serviceId = localStorageManagement.getValue('SERVICEID');
        vm.serviceId = 12;
        $rootScope.dashboardTitle = 'Bitcoin service | Rehive';
        $scope.bitcoinSettingView = '';
        $scope.loadingHdkeys =  true;
        $scope.addingHdkey =  false;
        $scope.deactivatingBitcoin = false;

        $scope.goToBitcoinSetting = function (setting) {
            $scope.bitcoinSettingView = setting;
        };
        $scope.goToBitcoinSetting('hdkeys');

        $scope.deactivateBitcoinServiceConfirm = function () {
            $ngConfirm({
                title: 'Deactivate service',
                contentUrl: 'app/pages/services/bitcoinService/bitcoinServiceSettings/bitcoinDeactivation/bitcoinDeactivationPrompt.html',
                animationBounce: 1,
                animationSpeed: 100,
                scope: $scope,
                buttons: {
                    Add: {
                        text: "Deactivate",
                        btnClass: 'btn-default dashboard-btn',
                        keys: ['enter'], // will trigger when enter is pressed
                        action: function(scope){
                            scope.deactivateBitcoinService(scope.password);
                        }
                    },
                    close: {
                        text: "Cancel",
                        btnClass: 'btn-primary dashboard-btn'
                    }
                }
            });
        };

        $scope.deactivateBitcoinService = function (password) {
            if(vm.token) {
                $scope.deactivatingBitcoin = true;
                $http.put(environmentConfig.API + '/admin/services/' + vm.serviceId + '/',{password: password,active: false}, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $timeout(function () {
                            $scope.deactivatingBitcoin = false;
                            toastr.success('Service has been successfully deactivated');
                            $location.path('/services');
                        },600);
                    }
                }).catch(function (error) {
                    $scope.deactivatingBitcoin = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

    }
})();
