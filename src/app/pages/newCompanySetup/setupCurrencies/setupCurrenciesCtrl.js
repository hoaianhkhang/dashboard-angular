(function () {
    'use strict';

    angular.module('BlurAdmin.pages.newCompanySetup.setupCurrencies')
        .controller("SetupCurrenciesCtrl", SetupCurrenciesCtrl);

    function SetupCurrenciesCtrl($rootScope,$scope,$http,toastr,cookieManagement,currenciesList,
        environmentConfig,$location,errorHandler) {
        var vm=this;
        vm.token=cookieManagement.getCookie("TOKEN");
        $scope.addedGroups = [];
        $scope.name="";
        $rootScope.$pageFinishedLoading=true;
        $scope.currenciesToAdd = [];
        $scope.initialCurrencies = currenciesList;
        $scope.goToNextView=function () {
            $rootScope.userFullyVerified = true;
            $location.path('company/setup/accounts');
        }
        $scope.goToPrevView=function () {
            $rootScope.userFullyVerified = true;
            $location.path('/company/setup/users');
        }

        vm.getCurrencies = function(){
            if(vm.token){
                $http.get(environmentConfig.API + '/admin/currencies/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $scope.currencies = res.data.data.results;
                    }
                }).catch(function (error) {
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        vm.getCurrencies();
        
        $scope.addCurrencies = function (currencies) {
            
            currencies.forEach(function(currency){
                currency.enabled = true;
                $http.post(environmentConfig.API + '/admin/currencies/',currency, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 201) {
                        $scope.currencies.push(currency);
                    }
                }).catch(function (error) {
                    $rootScope.$pageFinishedLoading = true;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            });
            
            $scope.currenciesToAdd = [];
        }
    }
})();
