(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarService.stellarServiceAssets')
        .controller('StellarServiceAssetsCtrl', StellarServiceAssetsCtrl);

    /** @ngInject */
    function StellarServiceAssetsCtrl($scope,localStorageManagement,environmentConfig,$filter,$http,errorHandler,$uibModal) {

        $scope.stellarAccountSettingView = '';

        var vm = this, extensionsList = JSON.parse(localStorageManagement.getValue('extensionsList'));
        vm.serviceUrl = extensionsList[2];
        // vm.serviceUrl = "https://stellar.services.rehive.io/api/1/";
        vm.token = localStorageManagement.getValue('TOKEN');
        $scope.stellarCurrency = {};
        $scope.assetsObj = [];

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

                if($scope.assetsObj.length > 0){
                    $scope.assetsObj.length = 0;
                }

                $http.get(vm.serviceUrl + 'admin/asset/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        var assets = res.data.data;
                        if(assets.length > 0){
                            assets.forEach(function (asset,index,array) {
                                if(index === array.length - 1){
                                    vm.getAssetsBalance(asset,'last');
                                } else {
                                    vm.getAssetsBalance(asset);
                                }
                            });
                        } else {
                            $scope.loadingAssets =  false;
                        }
                    }
                }).catch(function (error) {
                    $scope.loadingAssets =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.getAssetsBalance = function (asset,last) {
            if(asset){
                $http.get(vm.serviceUrl + 'admin/asset/' + asset.id + '/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        asset.balance = $filter("currencyModifiersFilter")(res.data.data.rehive_acc_balance.available_balance,res.data.data.rehive_acc_balance.currency.divisibility);
                        $scope.assetsObj.push(asset);
                        if(last){
                            $scope.loadingAssets =  false;
                        }
                    }
                }).catch(function (error) {
                    $scope.loadingAssets =  false;
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
