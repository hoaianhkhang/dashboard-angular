(function () {
    'use strict';

    angular.module('BlurAdmin.pages.newCompanySetup.setupCurrencies')
        .controller("SetupCurrenciesCtrl", SetupCurrenciesCtrl);

    function SetupCurrenciesCtrl($rootScope,$scope,toastr,currenciesList,$ngConfirm,
                                 Rehive,$location,errorHandler,$uibModal,localStorageManagement,$window,$timeout) {

        var vm = this;
        vm.token = localStorageManagement.getValue("token");
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
                Rehive.admin.currencies.get({filters: {
                    archived: false,
                    page_size: 250
                }}).then(function (res) {
                    $scope.currencies = res.results;
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

                        $window.sessionStorage.currenciesList = JSON.stringify(res.results);
                        $rootScope.setupCurrencies = 1;
                        localStorageManagement.setValue('setupCurrencies',1);
                    }
                    $scope.loadingCurrencies = false;
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingCurrencies = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            } else {
                $rootScope.gotToken = false;
                $rootScope.securityConfigured = true;
                $rootScope.pageTopObj = {};
                localStorageManagement.deleteValue('TOKEN');
                localStorageManagement.deleteValue('token');
                toastr.error('Your session has expired, please log in again');
                $location.path('/login');
            }
        };
        vm.getCurrencies();

        vm.getCompanyCurrencies = function(){
            if(vm.token){
                Rehive.admin.currencies.get({filters: {
                    archived: false,
                    page_size: 250
                }}).then(function (res) {
                    $window.sessionStorage.currenciesList = JSON.stringify(res.results);
                    $scope.$apply();
                }, function (error) {
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        
        $scope.addCurrencies = function (currencies) {
            if(currencies && currencies.length > 0){
                $scope.loadingCurrencies = true;
                currencies.forEach(function(currency,index,array){
                    currency.archived = false;
                    Rehive.admin.currencies.create(currency).then(function (res) {
                        vm.getCompanyCurrencies();
                        $rootScope.setupCurrencies = 1;
                        localStorageManagement.setValue('setupCurrencies',1);
                        if(index == (array.length - 1)){
                            vm.getCurrencies();
                        }
                        $scope.$apply();
                    }, function (error) {
                        $scope.loadingCurrencies = false;
                        $rootScope.$pageFinishedLoading = true;
                        errorHandler.evaluateErrors(error);
                        errorHandler.handleErrors(error);
                        $scope.$apply();
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
                contentUrl: 'app/pages/newCompanySetup/setupCurrencies/deleteCurrencyPrompt.html',
                animationBounce: 1,
                animationSpeed: 100,
                scope: $scope,
                onScopeReady: function(){
                    $scope.currency = currency;
                },
                buttons: {
                    close: {
                        text: "Cancel",
                        btnClass: 'btn-default dashboard-btn'
                    },
                    Add: {
                        text: "Delete permanently",
                        btnClass: 'btn-danger',
                        keys: ['enter'], // will trigger when enter is pressed
                        action: function(scope){
                            if(scope.deleteText != 'DELETE'){
                                toastr.error('DELETE text did not match');
                                return;
                            }
                            scope.archiveCurrency(currency);
                        }
                    }
                }
            });
        };
        
        $scope.archiveCurrency = function (currency) {
            if(currency.archived){
                $scope.deleteCurrency(currency);
            } else {
                $scope.loadingCurrencies = true;
                Rehive.admin.currencies.update(currency.code, {archived : true}).then(function (res) {
                    $timeout(function () {
                        $scope.deleteCurrency(currency);
                    },1000);
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingCurrencies = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        $scope.deleteCurrency = function(currency){
            if(vm.token){
                $scope.loadingCurrencies = true;
                Rehive.admin.currencies.delete(currency.code).then(function (res) {
                    $scope.initialCurrencies.push(currency);
                    toastr.success('Currency deleted successfully');
                    $timeout(function () {
                        vm.getCurrencies();
                    },1000);
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingCurrencies = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
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
