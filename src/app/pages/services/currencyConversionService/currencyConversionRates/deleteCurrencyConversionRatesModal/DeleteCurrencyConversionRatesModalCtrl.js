(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.currencyConversionService.currencyConversionRates')
        .controller('DeleteCurrencyConversionRatesModalCtrl', DeleteCurrencyConversionRatesModalCtrl);

    function DeleteCurrencyConversionRatesModalCtrl($scope,$uibModalInstance,rate,toastr,$http,cookieManagement,errorHandler) {

        var vm = this;

        $scope.rate = rate;
        vm.token = cookieManagement.getCookie('TOKEN');
        vm.baseUrl = cookieManagement.getCookie('SERVICEURL');
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
