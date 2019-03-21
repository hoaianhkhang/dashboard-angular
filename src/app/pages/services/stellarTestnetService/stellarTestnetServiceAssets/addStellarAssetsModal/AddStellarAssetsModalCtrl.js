(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarTestnetService.stellarTestnetServiceAssets')
        .controller('AddStellarAssetsModalCtrl', AddStellarAssetsModalCtrl);

    function AddStellarAssetsModalCtrl($scope,$uibModalInstance,toastr,$http,localStorageManagement,errorHandler) {

        var vm = this, extensionsList = JSON.parse(localStorageManagement.getValue('extensionsList'));
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.baseUrl = extensionsList[78];
        // vm.baseUrl = "https://stellar-testnet.services.rehive.io/api/1/";
        $scope.addingassets = false;

        $scope.addAssets = function (assetParams) {
            $scope.addingassets = true;

            $http.post(vm.baseUrl + 'admin/asset/', assetParams, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.addingassets = false;
                if (res.status === 201) {
                    toastr.success('Asset successfully added');
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
