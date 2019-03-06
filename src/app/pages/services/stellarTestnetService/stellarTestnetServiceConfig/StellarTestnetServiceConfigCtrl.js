(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarTestnetService.stellarTestnetServiceConfig')
        .controller('StellarTestnetServiceConfigCtrl', StellarTestnetServiceConfigCtrl);

    /** @ngInject */
    function StellarTestnetServiceConfigCtrl($scope,$http,localStorageManagement,toastr,errorHandler,$location) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        // vm.serviceUrl = localStorageManagement.getValue('SERVICEURL');
        vm.serviceUrl = "https://stellar-testnet.services.rehive.io/api/1/";
        $scope.currentConfigView = 'hot wallet';
        $scope.hotwalletHasBeenFunded = false;
        $scope.warmStorageHasBeenFunded = false;
        $scope.hotwalletHasBeenFunded = false;
        $scope.warmStorage = {
            publicKey: ''
        };
        $scope.warmStoragePublicKeyLengthValid = false;
        $scope.showHelpMessage = false;
        $scope.fundingAccountUsingTestnet = false;

        $scope.goToConfigView = function (view) {
            $scope.currentConfigView = view;
        };

        $scope.copiedSuccessfully = function () {
            toastr.success('Address copied successfully');
        };

        $scope.fundAccountUsingFriendbot = function () {
            $scope.fundingAccountUsingTestnet = true;
            var address = $scope.hotWalletFundObj.account_address;
            var url = "https://friendbot.stellar.org/?addr=" + address;
            $http.get(url, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function (res) {
                if (res.status === 200) {
                    $scope.fundingAccountUsingTestnet = false;
                    $scope.hotwalletHasBeenFunded = true;
                }
            }).catch(function (error) {
                $scope.fundingAccountUsingTestnet = false;
                $scope.hotwalletHasBeenFunded = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        $scope.getFundHotwallet = function () {
            $scope.fundingHotwallet = true;
            $http.get(vm.serviceUrl + 'admin/hotwallet/fund/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                if (res.status === 200) {
                    $scope.hotWalletFundObj = res.data.data;
                    $scope.hotWalletFundObj.qr_code = 'https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=' + $scope.hotWalletFundObj.account_address + '&choe=UTF-8';
                    $scope.fundingHotwallet = false;
                }
            }).catch(function (error) {
                $scope.fundingHotwallet = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };
        $scope.getFundHotwallet();

        $scope.addWarmStoragePublicKey = function () {
            $scope.addingPublicKey = true;
            $http.post(vm.serviceUrl + 'admin/warmstorage/accounts/', {account_address: $scope.warmStorage.publicKey,status: 'Active'}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.addingPublicKey = false;
                if (res.status === 201) {
                    $scope.goToConfigView('finish');
                }
            }).catch(function (error) {
                $scope.addingPublicKey = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        $scope.onPublicKeyChange = function (warmStorage) {
            $scope.showHelpMessage = false;
            if(warmStorage.publicKey.length == 56){
                $scope.warmStoragePublicKeyLengthValid = true;
            } else {
                $scope.warmStoragePublicKeyLengthValid = false;
            }
        };

        $scope.goToAccountsView = function () {
            $location.path('services/stellar-testnet/accounts');
        };

    }
})();
