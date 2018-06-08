(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarService.stellarServiceAssets')
        .controller('StellarAssetsCtrl', StellarAssetsCtrl);

    /** @ngInject */
    function StellarAssetsCtrl($scope,localStorageManagement,environmentConfig,$http,errorHandler,$uibModal) {

        $scope.stellarAccountSettingView = '';

        var vm = this;
        vm.serviceUrl = localStorageManagement.getValue('SERVICEURL');
        vm.token = localStorageManagement.getValue('TOKEN');
        $scope.stellarCurrency = {};
        $scope.assetsObjLength = 0;

        vm.getXLMCurrency = function () {
            $scope.loadingAssets =  true;
            if(vm.token) {
                $http.get(environmentConfig.API + '/admin/currencies/XLM/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $scope.stellarCurrency = res.data.data;
                        vm.getAssets();
                    }
                }).catch(function (error) {
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        vm.getXLMCurrency();

        vm.getAssets = function () {
            $scope.loadingAssets =  true;
            if(vm.token) {
                $http.get(vm.serviceUrl + 'admin/asset/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingAssets =  false;
                    if (res.status === 200) {
                        $scope.assetsObj = res.data.data;
                        $scope.assetsObjLength = Object.keys($scope.assetsObj).length;
                    }
                }).catch(function (error) {
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.openAddAssetsModal = function (page, size) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'AddStellarAssetsModalCtrl',
                scope: $scope
            });

            vm.theModal.result.then(function(assets){
                if(assets){
                    vm.getAssets();
                }
            }, function(){
            });
        };

        $scope.openFundAssetsModal = function (page, size, asset_id) {
            vm.theFundModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'FundStellarAssetsModalCtrl',
                scope: $scope,
                resolve: {
                    assetId: function(){
                        return asset_id
                    }
                 }
            });
        };
    }
})();
