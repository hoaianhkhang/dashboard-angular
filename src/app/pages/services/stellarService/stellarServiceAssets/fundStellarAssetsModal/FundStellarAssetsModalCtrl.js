(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarService.stellarServiceAssets')
        .controller('FundStellarAssetsModalCtrl', FundStellarAssetsModalCtrl);

    function FundStellarAssetsModalCtrl($scope,toastr,$http,localStorageManagement,errorHandler) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.baseUrl = localStorageManagement.getValue('SERVICEURL');
        $scope.fundingassets = false;

        $scope.getFundassets = function () {
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
        $scope.getFundassets();

        $scope.addassets = function (assetParams) {
            $scope.addingassets = true;

            $http.post(vm.baseUrl + 'admin/asset/', assetParams, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.addingassets = false;
                if (res.status === 201) {
                    toastr.success('Asset successfully funded');
                    $uibModalInstance.close(res.data);
                }
            }).catch(function (error) {
                $scope.addingassets = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };



    }
})();
