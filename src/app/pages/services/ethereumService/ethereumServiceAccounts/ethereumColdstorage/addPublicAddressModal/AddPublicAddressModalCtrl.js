(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.ethereumService.ethereumServiceAccounts')
        .controller('AddPublicAddressModalCtrl', AddPublicAddressModalCtrl);

    function AddPublicAddressModalCtrl($scope,$uibModalInstance,toastr,$http,localStorageManagement,errorHandler) {

        var vm = this, extensionsList = JSON.parse(localStorageManagement.getValue('extensionsList'));
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.serviceUrl = extensionsList[6];
        // vm.serviceUrl = "https://ethereum.services.rehive.io/api/1/";
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