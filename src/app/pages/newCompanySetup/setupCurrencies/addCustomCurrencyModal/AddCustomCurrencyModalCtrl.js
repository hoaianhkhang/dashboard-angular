(function () {
    'use strict';

    angular.module('BlurAdmin.pages.newCompanySetup.setupCurrencies')
        .controller("AddCustomCurrencyModalCtrl", AddCustomCurrencyModalCtrl);

    function AddCustomCurrencyModalCtrl(Rehive,$scope,toastr,localStorageManagement,
                                        errorHandler,$uibModalInstance) {

        var vm = this;
        vm.token = localStorageManagement.getValue("token");
        $scope.newCurrencyParams = {};
        $scope.loadingCustomCurrencies = false;

        $scope.addCustomCompanyCurrency = function(newCurrencyParams){

            $scope.loadingCustomCurrencies = true;
            newCurrencyParams.archived = false;
            Rehive.admin.currencies.create(newCurrencyParams).then(function (res) {
                $scope.loadingCustomCurrencies = false;
                toastr.success('New custom currency has been created successfully');
                $uibModalInstance.close(res);
                $scope.$apply();
            }, function (error) {
                $scope.loadingCustomCurrencies = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

    }
})();
