(function () {
    'use strict';

    angular.module('BlurAdmin.pages.currencies')
        .controller('AddCurrencyModalCtrl', AddCurrencyModalCtrl);

    /** @ngInject */
    function AddCurrencyModalCtrl($scope,$http,environmentConfig,cookieManagement,$uibModalInstance,
                                  $window,currenciesList,errorHandler,toastr) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');

        $scope.currenciesToAdd = [];
        $scope.currenciesThatWillBeAdded = [];
        $scope.currenciesThatWillBeAddedType = '';
        $scope.initialCurrencies = currenciesList.slice();
        $scope.newCurrencyParams = {};
        $scope.showCustomCurrency = false;
        $scope.showCurrencyConfirmPanel = false;
        $scope.loadingCurrencies = false;

        $scope.goBackToCurrencySelectionView = function () {
            $scope.showCurrencyConfirmPanel = false;
        };

        $scope.goToconfirmSelection = function (type,currencies) {
            $scope.currenciesThatWillBeAdded = [];
            if(Array.isArray(currencies)){
                $scope.currenciesThatWillBeAddedType = 'normal';
                $scope.currenciesThatWillBeAdded = currencies.slice();
            } else {
                $scope.currenciesThatWillBeAddedType = 'custom';
                $scope.currenciesThatWillBeAdded.push(currencies);
            }

            $scope.showCurrencyConfirmPanel = true;
        };

        vm.getCurrencies = function(){
            $scope.loadingCurrencies = true;
            if(vm.token){
                $http.get(environmentConfig.API + '/admin/currencies/?enabled=true&page_size=250', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        res.data.data.results.forEach(function (currency) {
                            var index = $scope.initialCurrencies.findIndex(function (element) {
                                return element.code == currency.code;
                            });
                            if(index >=0){
                                $scope.initialCurrencies.splice(index,1);
                            }
                        });
                        $scope.loadingCurrencies = false;
                    }
                }).catch(function (error) {
                    $scope.loadingCurrencies = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        vm.getCurrencies();

        $scope.addCurrencyDependingOnType = function () {
            if($scope.currenciesThatWillBeAddedType == 'normal'){
                $scope.addCompanyCurrency($scope.currenciesThatWillBeAdded);
            } else{
                $scope.addCustomCompanyCurrency($scope.currenciesThatWillBeAdded[0]);
            }
        };

        $scope.addCompanyCurrency = function (currencies) {
            if(currencies && currencies.length > 0){
                $scope.loadingCurrencies = true;
                currencies.forEach(function(currency,index,array){
                    currency.enabled = true;
                    $http.post(environmentConfig.API + '/admin/currencies/',currency, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': vm.token
                        }
                    }).then(function (res) {
                        if (res.status === 201) {
                            if(index == (array.length - 1)){
                                vm.getCompanyCurrencies();
                                $scope.loadingCurrencies = false;
                                toastr.success('Currencies have been added successfully');
                                $uibModalInstance.close(true);
                            }
                        }
                    }).catch(function (error) {
                        $scope.loadingCurrencies = false;
                        errorHandler.evaluateErrors(error.data);
                        errorHandler.handleErrors(error);
                    });
                });

                $scope.currenciesToAdd = [];
            } else {
                toastr.info('Please select atleast one currency');
            }
        };

        $scope.addCustomCompanyCurrency = function(newCurrencyParams){

            $scope.loadingCurrencies = true;
            $scope.addCurrency = {};
            newCurrencyParams.enabled = true;
            $http.post(environmentConfig.API + '/admin/currencies/', newCurrencyParams, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.loadingCurrencies = false;
                if (res.status === 201) {
                    vm.getCompanyCurrencies();
                    $scope.loadingCurrencies = false;
                    toastr.success('Custom currency have been added successfully');
                    $uibModalInstance.close(true);
                }
            }).catch(function (error) {
                $scope.loadingCurrencies = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        vm.getCompanyCurrencies = function(){
            if(vm.token){
                $http.get(environmentConfig.API + '/admin/currencies/?enabled=true&page_size=250', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $window.sessionStorage.currenciesList = JSON.stringify(res.data.data.results);
                    }
                }).catch(function (error) {
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.toggleCustomCurrencyView = function () {
            $scope.showCustomCurrency = !$scope.showCustomCurrency;
        };

    }
})();
