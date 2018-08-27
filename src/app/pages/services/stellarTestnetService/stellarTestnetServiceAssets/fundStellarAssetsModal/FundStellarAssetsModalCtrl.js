(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarTestnetService.stellarTestnetServiceAssets')
        .controller('FundStellarAssetsModalCtrl', FundStellarAssetsModalCtrl);

    function FundStellarAssetsModalCtrl($scope,$uibModalInstance,toastr,$http,localStorageManagement,errorHandler, assetId) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.baseUrl = localStorageManagement.getValue('SERVICEURL');
        $scope.fundingassets = false;

        $scope.getFundAssets = function () {
            $scope.fundingassets = true;

            $http.get(vm.baseUrl + 'admin/hotwallet/fund/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.fundingassets = false;
                if (res.status === 200) {
                    $scope.assetsFundObj = res.data.data;
                    $scope.assetsFundObj.qr_code = 'https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=' + $scope.assetsFundObj.account_address + '&choe=UTF-8';
                }
            }).catch(function (error) {
                $scope.fundingassets = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };
        $scope.getFundAssets();

        $scope.addAssets = function (assetParams) {
            $scope.addingassets = true;

            $http.post(vm.baseUrl + 'admin/asset/' + assetId + '/fund/', assetParams, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.addingassets = false;
                if (res.status === 200) {
                    toastr.success('Asset successfully funded');
                    $uibModalInstance.close();
                }
            }).catch(function (error) {
                $scope.addingassets = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };



    }
})();
