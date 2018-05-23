(function () {
    'use strict';

    angular.module('BlurAdmin.pages.currencies')
        .controller('AddCurrencyModalCtrl', AddCurrencyModalCtrl);

    /** @ngInject */
    function AddCurrencyModalCtrl($scope,localStorageManagement,$uibModalInstance,
                                  $window,currenciesList,errorHandler,toastr,Rehive) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');

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
                Rehive.admin.currencies.get({filters: {
                    enabled: true,
                    page_size: 250
                }}).then(function (res) {
                    res.results.forEach(function (currency) {
                        var index = $scope.initialCurrencies.findIndex(function (element) {
                            return element.code == currency.code;
                        });
                        if(index >=0){
                            $scope.initialCurrencies.splice(index,1);
                        }
                    });
                    $scope.loadingCurrencies = false;
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingCurrencies = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
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
                    Rehive.admin.currencies.create(currency).then(function (res) {
                        if(index == (array.length - 1)){
                            vm.getCompanyCurrencies();
                            $scope.loadingCurrencies = false;
                            toastr.success('Currencies have been added successfully');
                            $uibModalInstance.close(true);
                        }
                    }, function (error) {
                        $scope.loadingCurrencies = false;
                        errorHandler.evaluateErrors(error.data);
                        errorHandler.handleErrors(error);
                        $scope.$apply();
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


            Rehive.admin.currencies.create(newCurrencyParams).then(function (res) {
                vm.getCompanyCurrencies();
                $scope.loadingCurrencies = false;
                toastr.success('Custom currency have been added successfully');
                $scope.$apply();
                $uibModalInstance.close(true);
            }, function (error) {
                $scope.loadingCurrencies = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

        vm.getCompanyCurrencies = function(){
            if(vm.token){
                Rehive.admin.currencies.get({filters: {
                    enabled: true,
                    page_size: 250
                }}).then(function (res) {
                    $window.sessionStorage.currenciesList = JSON.stringify(res.results);
                }, function (error) {
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        $scope.toggleCustomCurrencyView = function () {
            $scope.showCustomCurrency = !$scope.showCustomCurrency;
        };

    }
})();
