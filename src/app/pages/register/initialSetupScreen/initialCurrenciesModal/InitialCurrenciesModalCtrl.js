(function () {
    'use strict';

    angular.module('BlurAdmin.pages.initialSetupScreen')
        .controller('InitialCurrenciesModalModalCtrl', InitialCurrenciesModalModalCtrl);

    /** @ngInject */
    function InitialCurrenciesModalModalCtrl($scope,Rehive,$uibModalInstance,
                                             currenciesList,errorHandler,toastr,$location) {

        var vm = this;

        $scope.currenciesToAdd = [];
        $scope.initialCurrencies = currenciesList.slice();
        $scope.loadingDefaultValues = false;
        $scope.addingDefaultPermissionArray = [
            {type: "account", level: "view", section: "user"},
            {type: "account", level: "add", section: "user"},
            {type: "account", level: "change", section: "user"},
            {type: "account", level: "delete", section: "user"},
            {type: "address", level: "view", section: "user"},
            {type: "address", level: "add", section: "user"},
            {type: "address", level: "change", section: "user"},
            {type: "address", level: "delete", section: "user"},
            {type: "currency", level: "view", section: "user"},
            {type: "currency", level: "add", section: "user"},
            {type: "currency", level: "change", section: "user"},
            {type: "currency", level: "delete", section: "user"},
            {type: "bankaccount", level: "view", section: "user"},
            {type: "bankaccount", level: "add", section: "user"},
            {type: "bankaccount", level: "change", section: "user"},
            {type: "bankaccount", level: "delete", section: "user"},
            {type: "company", level: "view", section: "user"},
            {type: "company", level: "add", section: "user"},
            {type: "company", level: "change", section: "user"},
            {type: "company", level: "delete", section: "user"},
            {type: "cryptoaccount", level: "view", section: "user"},
            {type: "cryptoaccount", level: "add", section: "user"},
            {type: "cryptoaccount", level: "change", section: "user"},
            {type: "cryptoaccount", level: "delete", section: "user"},
            {type: "document", level: "view", section: "user"},
            {type: "document", level: "add", section: "user"},
            {type: "document", level: "change", section: "user"},
            {type: "document", level: "delete", section: "user"},
            {type: "email", level: "view", section: "user"},
            {type: "email", level: "add", section: "user"},
            {type: "email", level: "change", section: "user"},
            {type: "email", level: "delete", section: "user"},
            {type: "group", level: "view", section: "user"},
            {type: "group", level: "add", section: "user"},
            {type: "group", level: "change", section: "user"},
            {type: "group", level: "delete", section: "user"},
            {type: "mfa", level: "view", section: "user"},
            {type: "mfa", level: "add", section: "user"},
            {type: "mfa", level: "change", section: "user"},
            {type: "mfa", level: "delete", section: "user"},
            {type: "mobile", level: "view", section: "user"},
            {type: "mobile", level: "add", section: "user"},
            {type: "mobile", level: "change", section: "user"},
            {type: "mobile", level: "delete", section: "user"},
            {type: "token", level: "view", section: "user"},
            {type: "token", level: "add", section: "user"},
            {type: "token", level: "change", section: "user"},
            {type: "token", level: "delete", section: "user"},
            {type: "transaction", level: "view", section: "user"},
            {type: "transaction", level: "add", section: "user"},
            {type: "transaction", level: "change", section: "user"},
            {type: "transaction", level: "delete", section: "user"},
            {type: "user", level: "view", section: "user"},
            {type: "user", level: "add", section: "user"},
            {type: "user", level: "change", section: "user"},
            {type: "user", level: "delete", section: "user"}
        ];

        $scope.addCompanyCurrency = function (currencies) {
            if(currencies && currencies.length > 0){
                $scope.loadingDefaultValues = true;
                currencies.forEach(function(currency,index,array){
                    currency.archived = false;
                    Rehive.admin.currencies.create(currency).then(function (res) {
                        if (index == (array.length - 1)) {
                            vm.addDefaultValues();
                            $scope.$apply();
                        }
                    }, function (error) {
                        $scope.loadingDefaultValues = false;
                        errorHandler.evaluateErrors(error);
                        errorHandler.handleErrors(error);
                        $scope.$apply();
                    });
                });
            } else {
                toastr.info('Please select atleast one currency');
            }
        };

        vm.addDefaultValues = function(){
            Rehive.admin.groups.create({
                name: 'user',
                label: 'user',
                default: true,
                public: true
            }).then(function (res) {
                vm.addDefaultPermissions();
                $scope.$apply();
            }, function (error) {
                $scope.loadingDefaultValues = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

        vm.addDefaultPermissions = function () {
            Rehive.admin.groups.permissions.create('user',{permissions: $scope.addingDefaultPermissionArray}).then(function (res) {
                vm.addAccountConfiguration();
                $scope.$apply();
            }, function (error) {
                $scope.loadingDefaultValues = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

        vm.addAccountConfiguration = function () {
            Rehive.admin.groups.accountConfigurations.create('user',
            {
                name: 'default',
                label: 'Default',
                primary: true,
                default: true
            }).then(function (res) {
                vm.addCurrenciesAccount();
                $scope.$apply();
            }, function (error) {
                $scope.loadingDefaultValues = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

        vm.addCurrenciesAccount = function () {
            $scope.currenciesToAdd.forEach(function(element,i,array) {
                Rehive.admin.groups.accountConfigurations.currencies.create('user','default',
                {
                    currency: element.code
                }).then(function (res) {
                    if(i == (array.length - 1)){
                        $scope.loadingDefaultValues = false;
                        toastr.success('Company has been setup with default values');
                        $uibModalInstance.close();
                        $location.path('/currencies');
                        $scope.$apply();
                    }
                }, function (error) {
                    $scope.loadingDefaultValues = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            });
        };

    }
})();
