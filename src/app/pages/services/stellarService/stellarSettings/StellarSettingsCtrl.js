(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarService.stellarSettings')
        .controller('StellarSettingsCtrl', StellarSettingsCtrl);

    /** @ngInject */
    function StellarSettingsCtrl($rootScope,$scope,localStorageManagement,$http,$ngConfirm,environmentConfig,
                                        $timeout,toastr,$location,errorHandler) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.serviceId = localStorageManagement.getValue('SERVICEID');
        // $rootScope.dashboardTitle = 'Stellar service | Rehive';
        $rootScope.dashboardTitle = 'Stellar extension | Rehive';
        $scope.stellarSettingView = '';
        $scope.loadingHdkeys =  true;
        $scope.addingHdkey =  false;
        $scope.deactivatingStellar = false;

        $scope.goToStellarSetting = function (setting) {
            $scope.stellarSettingView = setting;
        };
        $scope.goToStellarSetting('deactivation');

        $scope.deactivateStellarServiceConfirm = function () {
            $ngConfirm({
                // title: 'Deactivate service',
                title: 'Deactivate extension',
                contentUrl: 'app/pages/services/stellarService/stellarSettings/stellarDeactivation/stellarDeactivationPrompt.html',
                animationBounce: 1,
                animationSpeed: 100,
                scope: $scope,
                buttons: {
                    Add: {
                        text: "Deactivate",
                        btnClass: 'btn-default dashboard-btn',
                        keys: ['enter'], // will trigger when enter is pressed
                        action: function(scope){
                            scope.deactivateStellarService(scope.password);
                        }
                    },
                    close: {
                        text: "Cancel",
                        btnClass: 'btn-primary dashboard-btn'
                    }
                }
            });
        };

        $scope.deactivateStellarService = function (password) {
            if(vm.token) {
                $scope.deactivatingStellar = true;
                $http.put(environmentConfig.API + '/admin/services/' + vm.serviceId + '/',{password: password,active: false}, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $timeout(function () {
                            $scope.deactivatingStellar = false;
                            toastr.success('Extension has been successfully deactivated');
                            // toastr.success('Service has been successfully deactivated');
                            // $location.path('/services');
                            $location.path('/extensions');
                        },600);
                    }
                }).catch(function (error) {
                    $scope.deactivatingStellar = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

    }
})();
