(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.bitcoinService.bitcoinServiceAccounts')
        .controller('FundBitcoinHotwalletModalCtrl', FundBitcoinHotwalletModalCtrl);

    function FundBitcoinHotwalletModalCtrl($scope,toastr,$http,localStorageManagement,errorHandler) {

        var vm = this, extensionsList = JSON.parse(localStorageManagement.getValue('extensionsList'));
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.baseUrl = localStorageManagement.getValue('SERVICEURL');
        vm.baseUrl = (vm.baseUrl.indexOf('bitcoin-testnet') > 0) ? extensionsList[12] : extensionsList[7];
        // vm.baseUrl = "https://bitcoin-testnet.services.rehive.io/api/1/";
        $scope.fundingHotwallet = false;
        $scope.hotwalletParams = {
            low_balance_percentage: 0.1
        };

        $scope.copiedSuccessfully = function () {
            toastr.success('Address copied successfully');
        };

        $scope.getFundHotwallet = function () {
            $scope.fundingHotwallet = true;

            $http.get(vm.baseUrl + 'admin/hotwallet/fund/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.fundingHotwallet = false;
                if (res.status === 200) {
                    $scope.hotWalletFundObj = res.data.data.crypto;
                }
            }).catch(function (error) {
                $scope.fundingHotwallet = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };
        $scope.getFundHotwallet();



    }
})();
