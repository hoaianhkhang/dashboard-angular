(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarTestnetService.stellarTestnetSettings')
        .controller('StellarTestnetSettingsCtrl', StellarTestnetSettingsCtrl);

    /** @ngInject */
    function StellarTestnetSettingsCtrl($rootScope,$scope,localStorageManagement,$http,$ngConfirm,environmentConfig,
                                        $timeout,toastr,$location,errorHandler) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.serviceId = localStorageManagement.getValue('SERVICEID');
        // $rootScope.dashboardTitle = 'Stellar testnet service | Rehive';
        $rootScope.dashboardTitle = 'Stellar testnet extension | Rehive';
        $scope.stellarTestnetSettingView = '';
        $scope.loadingHdkeys =  true;
        $scope.addingHdkey =  false;
        $scope.deactivatingStellarTestnet = false;

        $scope.goToStellarTestnetSetting = function (setting) {
            $scope.stellarTestnetSettingView = setting;
        };
        $scope.goToStellarTestnetSetting('deactivation');

        $scope.deactivateStellarTestnetServiceConfirm = function () {
            $ngConfirm({
                title: 'Deactivate extension',
                // title: 'Deactivate service',
                contentUrl: 'app/pages/services/stellarTestnetService/stellarTestnetSettings/stellarTestnetDeactivation/stellarTestnetDeactivationPrompt.html',
                animationBounce: 1,
                animationSpeed: 100,
                scope: $scope,
                buttons: {
                    Add: {
                        text: "Deactivate",
                        btnClass: 'btn-default dashboard-btn',
                        keys: ['enter'], // will trigger when enter is pressed
                        action: function(scope){
                            scope.deactivateStellarTestnetService(scope.password);
                        }
                    },
                    close: {
                        text: "Cancel",
                        btnClass: 'btn-primary dashboard-btn'
                    }
                }
            });
        };

        $scope.deactivateStellarTestnetService = function (password) {
            if(vm.token) {
                $scope.deactivatingStellarTestnet = true;
                $http.put(environmentConfig.API + '/admin/services/' + vm.serviceId + '/',{password: password,active: false}, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $timeout(function () {
                            $scope.deactivatingStellarTestnet = false;
                            toastr.success('Extension has been successfully deactivated');
                            // toastr.success('Service has been successfully deactivated');
                            // $location.path('/services');
                            $location.path('/extensions');
                        },600);
                    }
                }).catch(function (error) {
                    $scope.deactivatingStellarTestnet = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

    }
})();
