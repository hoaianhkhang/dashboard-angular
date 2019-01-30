(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.currencyConversionService.currencyConversionRates')
        .controller('EditCurrencyConversionRatesModalCtrl', EditCurrencyConversionRatesModalCtrl);

    /** @ngInject */
    function EditCurrencyConversionRatesModalCtrl($scope,$uibModalInstance,currenciesList,toastr,cleanObject,
                                                  currencyModifiers,$http,localStorageManagement,errorHandler, rate) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.baseUrl = localStorageManagement.getValue('SERVICEURL');
        $scope.updatingRate = false;
        $scope.invalidAmount = false;
        $scope.currenciesList = currenciesList;

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
                from_currency: $scope.rate.from_currency.code,
                to_currency: $scope.rate.to_currency.code,
                fixed_rate: $scope.rate.fixed_rate ? $scope.rate.fixed_rate.toString(): null
            };
            var cleanRate = cleanObject.cleanObj(newRate);

            $http.patch(vm.baseUrl + 'admin/rates/' + $scope.rate.id + '/', cleanRate, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.updatingRate = false;
                if (res.status === 201) {
                    toastr.success('Rate successfully added');
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
/*Insert into newRate if required.*/
// from_percentage_fee: $scope.rate.from_percentage_fee || null,
// from_value_fee: $scope.rate.from_value_fee ? currencyModifiers.convertToCents($scope.rate.from_value_fee,$scope.rate.fromCurrency.divisibility) : null,
//