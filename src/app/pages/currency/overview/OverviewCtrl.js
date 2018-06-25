(function () {
    'use strict';

    angular.module('BlurAdmin.pages.currency.overview')
        .controller('OverviewCtrl', OverviewCtrl);

    /** @ngInject */
    function OverviewCtrl($scope,$location,$stateParams,localStorageManagement,$window,Rehive,errorHandler) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        $scope.currencyCode = $stateParams.currencyCode;
        vm.currenciesList = JSON.parse($window.sessionStorage.currenciesList || '[]');
        $scope.loadingCurrencies = true;
        vm.location = $location.path();
        vm.locationArray = vm.location.split('/');
        $scope.locationIndicator = vm.locationArray[vm.locationArray.length - 1];
        vm.currenciesList.forEach(function (element) {
            if(element.code == $scope.currencyCode){
                $scope.currencyObj = element;
            }
        });

        vm.getCurrencyOverview = function () {
            if(vm.token) {
                $scope.loadingCurrencies = true;
                Rehive.admin.currencies.overview.get($scope.currencyCode).then(function (res) {
                    $scope.currencyOverviewData = res;
                    $scope.loadingCurrencies = false;
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingCurrencies = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.getCurrencyOverview();

        vm.getCurrencyOverviewUsersData = function () {
            if(vm.token) {
                $scope.loadingUsers = true;
                Rehive.admin.users.overview.get().then(function (res) {
                    $scope.currencyOverviewUsersData = res;
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingUsers = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.getCurrencyOverviewUsersData();

        $scope.goToPath = function (path) {
          $location.path(path);
        };


    }
})();