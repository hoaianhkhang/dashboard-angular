(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.ethereumService.ethereumServiceAccounts')
        .controller('FundEthereumHotwalletModalCtrl', FundEthereumHotwalletModalCtrl);

    function FundEthereumHotwalletModalCtrl($scope,toastr,$http,localStorageManagement,errorHandler) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        // vm.baseUrl = localStorageManagement.getValue('SERVICEURL');
        vm.baseUrl = "https://ethereum.services.rehive.io/api/1/";
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
                    $scope.hotWalletFundObj = res.data.data;
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
