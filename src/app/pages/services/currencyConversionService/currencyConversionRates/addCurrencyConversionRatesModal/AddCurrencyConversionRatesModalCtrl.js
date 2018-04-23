(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.currencyConversionService.currencyConversionRates')
        .controller('AddCurrencyConversionRatesModalCtrl', AddCurrencyConversionRatesModalCtrl);

    function AddCurrencyConversionRatesModalCtrl($scope,$uibModalInstance,currenciesList,toastr,cleanObject,
                                                 currencyModifiers,$http,localStorageManagement,errorHandler) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.baseUrl = localStorageManagement.getValue('SERVICEURL');
        $scope.addingRate = false;
        $scope.invalidAmount = false;
        $scope.rateParams = {
            fromCurrency: {
                code: ''
            },
            toCurrency: {
                code: ''
            }
        };
        $scope.currenciesList = currenciesList;

        $scope.validateNumberInput = function (value,currencyType) {
            var validAmount = currencyModifiers.validateCurrency(value,$scope.rateParams[currencyType].divisibility);
            if(!validAmount){
                $scope.invalidAmount = true;
                toastr.error('Please input amount to ' + $scope.rateParams[currencyType].divisibility + ' decimal places');
            } else {
                $scope.invalidAmount = false;
            }
        };

        $scope.addRate = function () {
            $scope.addingRate = true;

            var newRate = {
                from_currency: $scope.rateParams.fromCurrency.code,
                to_currency: $scope.rateParams.toCurrency.code,
                from_percentage_fee: $scope.rateParams.from_percentage_fee || null,
                from_value_fee: $scope.rateParams.from_value_fee ? currencyModifiers.convertToCents($scope.rateParams.from_value_fee,$scope.rateParams.fromCurrency.divisibility) : null,
                fixed_rate: $scope.rateParams.fixed_rate ? $scope.rateParams.fixed_rate.toString(): null
            };

            var cleanRate = cleanObject.cleanObj(newRate);

            $http.post(vm.baseUrl + 'admin/rates/', cleanRate, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.addingRate = false;
                if (res.status === 201) {
                    toastr.success('Rate successfully added');
                    $uibModalInstance.close(res.data);
                }
            }).catch(function (error) {
                $scope.addingRate = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };



    }
})();
