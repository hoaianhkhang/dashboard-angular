(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.productsService.productsSettings')
        .controller('ProductsSettingsCtrl', ProductsSettingsCtrl);

    /** @ngInject */
    function ProductsSettingsCtrl($rootScope,$scope,localStorageManagement,$http,$ngConfirm,environmentConfig,
                                        $timeout,toastr,$location,errorHandler) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.serviceId = localStorageManagement.getValue('SERVICEID');
        $rootScope.dashboardTitle = 'Products service | Rehive';
        $scope.productsSettingView = '';
        $scope.loadingHdkeys =  true;
        $scope.addingHdkey =  false;
        $scope.deactivatingProducts = false;

        $scope.goToProductsSetting = function (setting) {
            $scope.productsSettingView = setting;
        };
        $scope.goToProductsSetting('deactivation');

        $scope.deactivateProductsServiceConfirm = function () {
            $ngConfirm({
                title: 'Deactivate service',
                contentUrl: 'app/pages/services/productsService/productsSettings/productsDeactivation/productsDeactivationPrompt.html',
                animationBounce: 1,
                animationSpeed: 100,
                scope: $scope,
                buttons: {
                    Add: {
                        text: "Deactivate",
                        btnClass: 'btn-default dashboard-btn',
                        keys: ['enter'], // will trigger when enter is pressed
                        action: function(scope){
                            scope.deactivateProductsService(scope.password);
                        }
                    },
                    close: {
                        text: "Cancel",
                        btnClass: 'btn-primary dashboard-btn'
                    }
                }
            });
        };

        $scope.deactivateProductsService = function (password) {
            if(vm.token) {
                $scope.deactivatingProducts = true;
                $http.put(environmentConfig.API + '/admin/services/' + vm.serviceId + '/',{password: password,active: false}, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $timeout(function () {
                            $scope.deactivatingProducts = false;
                            toastr.success('Service has been successfully deactivated');
                            $location.path('/services');
                        },600);
                    }
                }).catch(function (error) {
                    $scope.deactivatingProducts = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

    }
})();
