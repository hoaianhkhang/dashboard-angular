(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.bitcoinService.bitcoinServiceAccounts')
        .controller('BitcoinHotwalletCtrl', BitcoinHotwalletCtrl);

    /** @ngInject */
    function BitcoinHotwalletCtrl($scope,cookieManagement,currenciesList,$http,errorHandler,$uibModal) {
        $scope.bitcoinAccountSettingView = '';

        var vm = this;
        vm.serviceUrl = cookieManagement.getCookie('SERVICEURL');
        vm.token = cookieManagement.getCookie('TOKEN');
        $scope.bitcoinCurrency = currenciesList.find(function (element) {
            return element.code == 'XBT';
        });
        $scope.loadingHotwallet = true;
        $scope.hotwalletObjLength = 0;


        vm.getHotwalletActive = function () {
            $scope.loadingHotwallet =  true;
            if(vm.token) {
                $http.get(vm.serviceUrl + 'admin/hotwallet/active/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingHotwallet =  false;
                    if (res.status === 200) {
                        $scope.hotwalletObj = res.data.data;
                        $scope.hotwalletObjLength = Object.keys($scope.hotwalletObj).length;
                    }
                }).catch(function (error) {
                    $scope.loadingHotwallet =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        vm.getHotwalletActive();

        $scope.openAddHotwalletModal = function (page, size) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'AddBitcoinHotwalletModalCtrl',
                scope: $scope
            });

            vm.theModal.result.then(function(hotwallet){
                if(hotwallet){
                    vm.getHotwalletActive();
                }
            }, function(){
            });
        };

        $scope.openFundHotwalletModal = function (page, size) {
            vm.theFundModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'FundBitcoinHotwalletModalCtrl',
                scope: $scope
            });
        };

    }
})();
