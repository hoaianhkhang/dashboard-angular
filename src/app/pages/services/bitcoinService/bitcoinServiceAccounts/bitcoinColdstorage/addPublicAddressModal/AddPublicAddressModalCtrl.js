(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.bitcoinService.bitcoinServiceAccounts')
        .controller('AddPublicAddressModalCtrl', AddPublicAddressModalCtrl);

    function AddPublicAddressModalCtrl($scope,$uibModalInstance,toastr,$http,localStorageManagement,errorHandler) {

        var vm = this, extensionsList = localStorageManagement.getValue('extensionsList');
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.serviceUrl = localStorageManagement.getValue('SERVICEURL');
        vm.serviceUrl = (vm.serviceUrl.indexOf('bitcoin-testnet') > 0) ? extensionsList[12] : extensionsList[7];
        // vm.serviceUrl = "https://bitcoin-testnet.services.rehive.io/api/1/";
        $scope.addingPublicAddress = false;
        $scope.publicAddressParams = {
            address: ''
        };

        $scope.addPublicAddress = function (publicAddressParams) {
            $scope.addingPublicAddress = true;

            $http.post(vm.serviceUrl + 'admin/coldstorage/public-addresses/', publicAddressParams, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.addingPublicAddress = false;
                if (res.status === 201) {
                    toastr.success('Public address successfully added');
                    $uibModalInstance.close(res.data);
                }
            }).catch(function (error) {
                $scope.addingPublicAddress = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };




    }
})();