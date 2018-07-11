(function () {
    'use strict';

    angular.module('BlurAdmin.pages.newCompanySetup.setupCurrencies')
        .controller("SetupCurrenciesCtrl", SetupCurrenciesCtrl);

    function SetupCurrenciesCtrl($rootScope,$scope,$http,toastr,currenciesList,$ngConfirm,
        environmentConfig,$location,errorHandler,$uibModal,localStorageManagement,$window,$timeout) {

        var vm = this;
        vm.token = localStorageManagement.getValue("TOKEN");
        $scope.currenciesToAdd = [];
        $rootScope.activeSetupRoute = 1;
        localStorageManagement.setValue('activeSetupRoute',1);
        $scope.initialCurrencies = currenciesList.slice();
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
                $http.get(environmentConfig.API + '/admin/currencies/?enabled=true&page_size=250', {
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
                            $scope.currencies.forEach(function (currency) {
                                var index = $scope.initialCurrencies.findIndex(function (element) {
                                    return element.code == currency.code;
                                });
                                if(index >=0){
                                    $scope.initialCurrencies.splice(index,1);
                                }
                            });

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
            } else {
                $rootScope.gotToken = false;
                $rootScope.securityConfigured = true;
                $rootScope.pageTopObj = {};
                localStorageManagement.deleteValue('TOKEN');
                toastr.error('Your session has expired, please log in again');
                $location.path('/login');
            }
        };
        vm.getCurrencies();

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
                            if(index == (array.length - 1)){
                                vm.getCurrencies();
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

        $scope.deleteCurrencyConfirm = function (currency) {
            $ngConfirm({
                title: 'Delete currency',
                content: 'Are you sure you want to delete this currency?',
                animationBounce: 1,
                animationSpeed: 100,
                scope: $scope,
                buttons: {
                    close: {
                        text: "No",
                        btnClass: 'btn-default pull-left dashboard-btn'
                    },
                    ok: {
                        text: "Yes",
                        btnClass: 'btn-primary dashboard-btn',
                        keys: ['enter'], // will trigger when enter is pressed
                        action: function(scope){
                            $scope.deleteCurrency(currency);
                        }
                    }
                }
            });
        };

        $scope.deleteCurrency = function(currency){
            if(vm.token){
                $scope.loadingCurrencies = true;
                $http.delete(environmentConfig.API + '/admin/currencies/'+ currency.code + '/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $scope.initialCurrencies.push(currency);
                        $timeout(function () {
                            vm.getCurrencies();
                        },1000);
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
