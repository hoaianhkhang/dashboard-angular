(function () {
    'use strict';

    angular.module('BlurAdmin.pages.initialSetupScreen')
        .controller("InitialSetupScreenCtrl", InitialSetupScreenCtrl);

    function InitialSetupScreenCtrl($rootScope,$scope,$location,$uibModal,errorHandler,$http,
                                    localStorageManagement,environmentConfig) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        $rootScope.dashboardTitle = 'Setup | Rehive';
        $rootScope.$pageFinishedLoading=true;
        $scope.companyCurrencies = [];
        $scope.showDefaultSetup = false;

        $scope.goToNextView=function () {
            $location.path('company/setup/groups');
        };

        vm.getCurrencies = function(){
            if(vm.token){
                $http.get(environmentConfig.API + '/admin/currencies/?enabled=true&page_size=250', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        if(res.data.data.results.length > 0){
                            $scope.showDefaultSetup = false;
                            $scope.companyCurrencies = res.data.data.results;
                        } else {
                            $scope.showDefaultSetup = true;
                            $scope.companyCurrencies = [];
                        }
                    }
                }).catch(function (error) {
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
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
