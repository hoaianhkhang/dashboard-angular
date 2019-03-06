(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.currencyConversionService.currencyConversionRates')
        .controller('EditCurrencyConversionRatesModalCtrl', EditCurrencyConversionRatesModalCtrl);

    /** @ngInject */
    function EditCurrencyConversionRatesModalCtrl($scope,$uibModalInstance,currenciesList,toastr,cleanObject,
                                                  currencyModifiers,$http,localStorageManagement,errorHandler, rate) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        // vm.baseUrl = localStorageManagement.getValue('SERVICEURL');
        vm.baseUrl = "https://conversion.services.rehive.io/api/";
        $scope.updatingRate = false;
        $scope.invalidAmount = false;
        $scope.currenciesList = [];

        vm.getServiceCurrencies = function(){
            $http.get(vm.baseUrl + 'admin/currencies/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                console.log(res);
                if (res.status === 200) {
                    $scope.currenciesList = res.data.data.results;
                }
            }).catch(function (error) {
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };
        vm.getServiceCurrencies();

        $scope.getRate = function () {
            $scope.updatingRate =  true;
            if(vm.token) {
                $http.get(vm.baseUrl + 'admin/rates/' + rate.id + '/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.updatingRate =  false;
                    if (res.status === 200) {
                      $scope.editRate = res.data.data;
                    }
                }).catch(function (error) {
                    $scope.updatingRate =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        $scope.getRate();

        $scope.validateNumberInput = function (value,currencyType) {
            var validAmount = currencyModifiers.validateCurrency(value,$scope.rateParams[currencyType].divisibility);
            if(!validAmount){
                $scope.invalidAmount = true;
                toastr.error('Please input amount to ' + $scope.rateParams[currencyType].divisibility + ' decimal places');
            } else {
                $scope.invalidAmount = false;
            }
        };
        $scope.updateRate = function () {
            $scope.updatingRate = true;
            var newRate = {
                from_currency: $scope.editRate.from_currency.code,
                to_currency: $scope.editRate.to_currency.code,
                fixed_rate: $scope.editRate.fixed_rate ? $scope.editRate.fixed_rate.toString(): null
            };
            var cleanRate = cleanObject.cleanObj(newRate);

            $http.patch(vm.baseUrl + 'admin/rates/' + $scope.editRate.id + '/', cleanRate, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.updatingRate = false;
                if (res.status === 201) {
                    toastr.success('Rate successfully updated');
                    $uibModalInstance.close(res.data);
                }
            }).catch(function (error) {
                $scope.updatingRate = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };



    }
})();
/***
 * from_percentage_fee: $scope.rate.from_percentage_fee || null,
 * from_value_fee: $scope.rate.from_value_fee ? currencyModifiers.convertToCents($scope.rate.from_value_fee,$scope.rate.fromCurrency.divisibility) : null,
***/