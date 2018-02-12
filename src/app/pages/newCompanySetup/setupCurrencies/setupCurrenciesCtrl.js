(function () {
    'use strict';

    angular.module('BlurAdmin.pages.newCompanySetup.setupCurrencies')
        .controller("SetupCurrenciesCtrl", SetupCurrenciesCtrl);

    function SetupCurrenciesCtrl($rootScope,$scope,$http,toastr,cookieManagement,currenciesList,
        environmentConfig,$location,errorHandler,$uibModal,localStorageManagement,$window) {

        var vm = this;
        vm.token=cookieManagement.getCookie("TOKEN");
        $scope.currenciesToAdd = [];
        $rootScope.activeSetupRoute = 1;
        localStorageManagement.setValue('activeSetupRoute',1);
        $scope.initialCurrencies = currenciesList;
        $scope.loadingCurrencies = true;

        $scope.goToNextView=function () {
            $location.path('company/setup/accounts');
        };

        $scope.goToPrevView=function () {
            $location.path('/company/setup/groups');
        };

        vm.getCurrencies = function(){
            $scope.loadingCurrencies = true;
            if(vm.token){
                $http.get(environmentConfig.API + '/admin/currencies/?enabled=true', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $scope.currencies = res.data.data.results;
                        if($scope.currencies.length==0){
                            $rootScope.setupCurrencies = 0;
                            localStorageManagement.setValue('setupCurrencies',0);
                        }
                        else {
                            $window.sessionStorage.currenciesList = JSON.stringify(res.data.data.results);
                            $rootScope.setupCurrencies = 1;
                            localStorageManagement.setValue('setupCurrencies',1);
                        }
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

        vm.getCompanyCurrencies = function(){
            if(vm.token){
                $http.get(environmentConfig.API + '/admin/currencies/?enabled=true', {
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
        
        $scope.addCurrencies = function (currencies) {
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
                            vm.getCompanyCurrencies();
                            $rootScope.setupCurrencies = 1;
                            localStorageManagement.setValue('setupCurrencies',1);
                            $scope.currencies.push(currency);
                            if(index == (array.length - 1)){
                                $scope.loadingCurrencies = false;
                            }
                        }
                    }).catch(function (error) {
                        $scope.loadingCurrencies = false;
                        $rootScope.$pageFinishedLoading = true;
                        errorHandler.evaluateErrors(error.data);
                        errorHandler.handleErrors(error);
                    });
                });

                $scope.currenciesToAdd = [];
            } else {
                toastr.info('Please select atleast one currency');
            }
        };

        $scope.deleteCurrency = function(code){
            if(vm.token){
                $scope.loadingCurrencies = true;
                $http.delete(environmentConfig.API + '/admin/currencies/'+code+'/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        vm.getCurrencies();
                    }
                }).catch(function (error) {
                    $scope.loadingCurrencies = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.openCustomCurrenyModal = function (page, size) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'AddCustomCurrencyModalCtrl',
                scope: $scope
            });

            vm.theModal.result.then(function(currency){
                if(currency){
                    vm.getCurrencies();
                }
            }, function(){
            });
        };
    }
})();
