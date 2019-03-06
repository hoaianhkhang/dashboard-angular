(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarService.stellarServiceAssets')
        .controller('AddStellarAssetsModalCtrl', AddStellarAssetsModalCtrl);

    function AddStellarAssetsModalCtrl($scope,$uibModalInstance,toastr,$http,localStorageManagement,errorHandler) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        // vm.baseUrl = localStorageManagement.getValue('SERVICEURL');
        vm.baseUrl = "https://stellar.services.rehive.io/api/1/";
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
