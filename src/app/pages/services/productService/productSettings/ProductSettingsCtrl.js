(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.productService.productSettings')
        .controller('ProductSettingsCtrl', ProductSettingsCtrl);

    /** @ngInject */
    function ProductSettingsCtrl($rootScope,$scope,localStorageManagement,$http,$ngConfirm,environmentConfig,
                                        $timeout,toastr,$location,errorHandler) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.serviceId = localStorageManagement.getValue('SERVICEID');
        $rootScope.dashboardTitle = 'Products service | Rehive';
        $scope.productSettingView = '';
        $scope.loadingHdkeys =  true;
        $scope.addingHdkey =  false;
        $scope.deactivatingProducts = false;

        $scope.goToProductsSetting = function (setting) {
            $scope.productSettingView = setting;
        };
        $scope.goToProductsSetting('deactivation');

        $scope.deactivateProductServiceConfirm = function () {
            $ngConfirm({
                title: 'Deactivate service',
                contentUrl: 'app/pages/services/productService/productSettings/productDeactivation/productDeactivationPrompt.html',
                animationBounce: 1,
                animationSpeed: 100,
                scope: $scope,
                buttons: {
                    Add: {
                        text: "Deactivate",
                        btnClass: 'btn-default dashboard-btn',
                        keys: ['enter'], // will trigger when enter is pressed
                        action: function(scope){
                            scope.deactivateProductService(scope.password);
                        }
                    },
                    close: {
                        text: "Cancel",
                        btnClass: 'btn-primary dashboard-btn'
                    }
                }
            });
        };

        $scope.deactivateProductService = function (password) {
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
