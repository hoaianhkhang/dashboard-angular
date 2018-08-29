(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groups.groupAccountConfigurations')
        .controller('AddGroupAccountConfigModalCtrl', AddGroupAccountConfigModalCtrl);

    function AddGroupAccountConfigModalCtrl($scope,$uibModalInstance,toastr,$stateParams,$filter,
                                            Rehive,localStorageManagement,errorHandler,$timeout) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        vm.groupName = $stateParams.groupName;
        $scope.loadingGroupAccountConfigurations = false;
        $scope.groupAccountConfigurationParams = {};
        $scope.newAccountConfigurationCurrencies = {
            list: []
        };
        $scope.currenciesList = [];

        vm.getCompanyCurrencies = function(){
            if(vm.token){
                Rehive.admin.currencies.get({filters: {
                    archived: false,
                    page_size: 250
                }}).then(function (res) {
                    $scope.currenciesList = res.results;
                    $scope.$apply();
                }, function (error) {
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.getCompanyCurrencies();

        $scope.groupAccountConfigurationNameToLowercase = function () {
            if($scope.groupAccountConfigurationParams.name){
                $scope.groupAccountConfigurationParams.name = $scope.groupAccountConfigurationParams.name.toLowerCase();
                $scope.groupAccountConfigurationParams.label = $filter('capitalizeWord')($scope.groupAccountConfigurationParams.name);
            }
        };

        $scope.addGroupAccountConfigurations = function(groupAccountConfigurationParams){
            if(vm.token) {
                $scope.loadingGroupAccountConfigurations = true;
                Rehive.admin.groups.accountConfigurations.create(vm.groupName,groupAccountConfigurationParams).then(function (res)
                {
                    $scope.groupAccountConfigurationParams = {};
                    $scope.addGroupAccountConfigurationCurrency(res);
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingGroupAccountConfigurations = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        $scope.addGroupAccountConfigurationCurrency = function (account) {
            $scope.loadingGroupAccountConfigurations = true;
            $scope.newAccountConfigurationCurrencies.list.forEach(function (element,index,array) {
                Rehive.admin.groups.accountConfigurations.currencies.create(vm.groupName,account.name,{currency: element.code}).then(function (res)
                {
                    if (index === array.length - 1){
                        $timeout(function () {
                            $scope.newAccountConfigurationCurrencies = {
                                list: []
                            };
                            $scope.loadingGroupAccountConfigurations = false;
                            toastr.success('Account configuration successfully added');
                            $uibModalInstance.close(res);
                        },100);
                        $scope.$apply();
                    }
                }, function (error) {
                    $scope.loadingGroupAccountConfigurations = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            });
        };


    }
})();
