(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.currencyConversionService.currencyConversionRates')
        .controller('DeleteCurrencyConversionRatesModalCtrl', DeleteCurrencyConversionRatesModalCtrl);

    function DeleteCurrencyConversionRatesModalCtrl($scope,$uibModalInstance,rate,toastr,$http,localStorageManagement,errorHandler) {

        var vm = this, extensionsList = JSON.parse(localStorageManagement.getValue('extensionsList'));

        $scope.rate = rate;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.baseUrl = extensionsList[9];
        // vm.baseUrl = "https://conversion.services.rehive.io/api/";
        $scope.deletingRate = false;


        $scope.deleteRate = function () {
            $scope.deletingRate = true;
            $http.delete(vm.baseUrl + 'admin/rates/' + $scope.rate.id + '/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.deletingRate = false;
                if (res.status === 200) {
                    toastr.success('Rate successfully deleted');
                    $uibModalInstance.close($scope.rate);
                }
            }).catch(function (error) {
                $scope.deletingRate = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };



    }
})();
