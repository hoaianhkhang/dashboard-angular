(function () {
    'use strict';

    angular.module('BlurAdmin.pages.newCompanySetup.setupCurrencies')
        .controller("AddCustomCurrencyModalCtrl", AddCustomCurrencyModalCtrl);

    function AddCustomCurrencyModalCtrl($scope,$http,toastr,localStorageManagement,
                                 environmentConfig,errorHandler,$uibModalInstance) {

        var vm = this;
        vm.token = localStorageManagement.getValue("TOKEN");
        $scope.newCurrencyParams = {};
        $scope.loadingCustomCurrencies = false;

        $scope.addCustomCompanyCurrency = function(newCurrencyParams){

            $scope.loadingCustomCurrencies = true;
            newCurrencyParams.enabled = true;
            $http.post(environmentConfig.API + '/admin/currencies/', newCurrencyParams, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.loadingCustomCurrencies = false;
                if (res.status === 201) {
                    toastr.success('New custom currency has been created successfully');
                    $uibModalInstance.close(res.data);
                }
            }).catch(function (error) {
                $scope.loadingCustomCurrencies = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

    }
})();
