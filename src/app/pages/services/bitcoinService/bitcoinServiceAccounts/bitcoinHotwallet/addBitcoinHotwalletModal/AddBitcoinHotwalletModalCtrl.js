(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.bitcoinService.bitcoinServiceAccounts')
        .controller('AddBitcoinHotwalletModalCtrl', AddBitcoinHotwalletModalCtrl);

    function AddBitcoinHotwalletModalCtrl($scope,$uibModalInstance,toastr,$http,localStorageManagement,errorHandler) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        // vm.baseUrl = localStorageManagement.getValue('SERVICEURL');
        vm.baseUrl = "https://bitcoin-testnet.services.rehive.io/api/1/";
        $scope.addingHotwallet = false;
        $scope.hotwalletParams = {
            low_balance_percentage: 0.1
        };

        $scope.addHotwallet = function (hotwalletParams) {
            $scope.addingHotwallet = true;

            $http.post(vm.baseUrl + 'admin/hotwallet/', hotwalletParams, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.addingHotwallet = false;
                if (res.status === 201) {
                    toastr.success('Hotwallet successfully added');
                    $uibModalInstance.close(res.data);
                }
            }).catch(function (error) {
                $scope.addingHotwallet = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };




    }
})();
