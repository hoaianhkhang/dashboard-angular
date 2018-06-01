(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarService.stellarServiceAssets')
        .controller('StellarAssetsCtrl', StellarAssetsCtrl);

    /** @ngInject */
    function StellarAssetsCtrl($scope,localStorageManagement,currenciesList,$http,errorHandler,$filter,$uibModal) {

        var vm = this;
        vm.serviceUrl = localStorageManagement.getValue('SERVICEURL');
        vm.token = localStorageManagement.getValue('TOKEN');
        $scope.stellarCurrency = currenciesList.find(function (element) {
        return element.code == 'XLM';
        });
        $scope.assetsObj = [];
        $scope.stellarAccountSettingView = '';

        vm.getAssets = function () {
            $scope.loadingAssets =  true;
            if(vm.token) {
                $http.get(vm.serviceUrl + 'admin/asset/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        res.data.data.forEach(function (asset,index,array) {
                            if(index === array.length - 1){
                                vm.getAssetsBalance(asset,'last');
                            } else {
                                vm.getAssetsBalance(asset);
                            }
                        });
                    }
                }).catch(function (error) {
                    $scope.loadingAssets =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        vm.getAssets();

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
