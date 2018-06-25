(function () {
    'use strict';

    angular.module('BlurAdmin.pages.initialSetupScreen')
        .controller("InitialSetupScreenCtrl", InitialSetupScreenCtrl);

    function InitialSetupScreenCtrl($rootScope,Rehive,$scope,$location,$uibModal,
                                    errorHandler,localStorageManagement) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        $rootScope.dashboardTitle = 'Setup | Rehive';
        $rootScope.$pageFinishedLoading=true;
        $scope.companyCurrencies = [];
        $scope.showDefaultSetup = false;

        $scope.goToNextView=function () {
            $rootScope.userFullyVerified = true;
            $location.path('company/setup/groups');
        };

        vm.getCurrencies = function(){
            if(vm.token){
                Rehive.admin.currencies.get({filters: {
                    enabled: true,
                    page_size: 250
                }}).then(function (res) {
                    if(res.results.length > 0){
                        $scope.showDefaultSetup = false;
                        $scope.companyCurrencies = res.results;
                    } else {
                        $scope.showDefaultSetup = true;
                        $scope.companyCurrencies = [];
                    }
                    $scope.$apply();
                }, function (error) {
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.getCurrencies();

        $scope.openPickInitialCurrenciesModal = function (page, size) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'InitialCurrenciesModalModalCtrl',
                scope: $scope
            });
        };

    }
})();
