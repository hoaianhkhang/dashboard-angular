(function () {
    'use strict';

    angular.module('BlurAdmin.pages.group.editAccountConfigurations')
        .controller('EditGroupAccountConfigurationCtrl', EditGroupAccountConfigurationCtrl);

    /** @ngInject */
    function EditGroupAccountConfigurationCtrl($scope,environmentConfig,$http,$stateParams,$timeout,$location,$ngConfirm,
                                            cookieManagement,errorHandler,toastr,serializeFiltersService) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
        vm.groupName = $stateParams.groupName;
        $scope.accountConfigName = $stateParams.accountConfigName;
        $scope.loadingGroupAccountConfigurations = true;
        $scope.editGroupAccountConfigurationObj = {};

        vm.getAccountConfiguration = function () {
            $scope.loadingGroupAccountConfigurations = true;
            $http.get(environmentConfig.API + '/admin/groups/' + vm.groupName + '/account-configurations/' + $scope.accountConfigName + '/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.loadingGroupAccountConfigurations = false;
                if (res.status === 200) {
                    $scope.editGroupAccountConfigurationObj = res.data.data;
                    $scope.editGroupAccountConfigurationObj.prevName = res.data.data.name;
                }
            }).catch(function (error) {
                $scope.loadingGroupAccountConfigurations = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };
        vm.getAccountConfiguration();

        $scope.updateAccountConfiguration = function (editGroupAccountConfigurationObj) {
            $scope.loadingGroupAccountConfigurations = true;
            $scope.editingGroupAccountConfiguration = !$scope.editingGroupAccountConfiguration;
            $http.patch(environmentConfig.API + '/admin/groups/' + vm.groupName + '/account-configurations/' + editGroupAccountConfigurationObj.prevName + '/',editGroupAccountConfigurationObj, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                if (res.status === 200) {
                    $scope.editGroupAccountConfigurationObj = {};
                    toastr.success('Account configuration successfully updated');
                    $scope.accountConfigName =  res.data.data.name;
                    vm.getAccountConfiguration();
                }
            }).catch(function (error) {
                $scope.loadingGroupAccountConfigurations = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        $scope.goBackToAccountConfigurations = function () {
            $location.path('/settings/groups-management/' + vm.groupName + '/account-configurations');
        };

        //account currencies

        $scope.newAccountConfigurationCurrencies = {
            list: []
        };
        $scope.groupAccountConfigurationCurrenciesList = [];
        $scope.currenciesList = [];

        $scope.pagination = {
            itemsPerPage: 6,
            pageNo: 1,
            maxSize: 5
        };

        vm.getCompanyCurrencies = function(){
            if(vm.token){
                $http.get(environmentConfig.API + '/admin/currencies/?enabled=true&page_size=250', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $scope.currenciesList = res.data.data.results;
                    }
                }).catch(function (error) {
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        vm.getCompanyCurrencies();

        vm.getAccountConfigurationCurrenciesUrl = function(){

            var searchObj = {
                page: $scope.pagination.pageNo,
                page_size: $scope.pagination.itemsPerPage
            };

            return environmentConfig.API + '/admin/groups/' + vm.groupName + '/account-configurations/' + $scope.accountConfigName + '/currencies/?' + serializeFiltersService.serializeFilters(searchObj);
        };

        $scope.getAccountConfigurationCurrencies = function(fromModalDelete){
            if(vm.token) {
                $scope.loadingGroupAccountConfigurations = true;

                if ($scope.groupAccountConfigurationCurrenciesList.length > 0) {
                    $scope.groupAccountConfigurationCurrenciesList.length = 0;
                }

                if(fromModalDelete){
                    $scope.pagination.pageNo = 1;
                }

                var groupAccountConfigurationCurrenciesUrl = vm.getAccountConfigurationCurrenciesUrl();

                $http.get(groupAccountConfigurationCurrenciesUrl,{
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingGroupAccountConfigurations = false;
                    if (res.status === 200) {
                        $scope.groupAccountConfigurationCurrenciesData = res.data.data;
                        $scope.groupAccountConfigurationCurrenciesList = res.data.data.results;
                    }
                }).catch(function (error) {
                    $scope.loadingGroupAccountConfigurations = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        $scope.getAccountConfigurationCurrencies();

        $scope.addGroupAccountConfigurationCurrency = function (newAccountConfigurationCurrencies) {
            $scope.loadingGroupAccountConfigurations = true;
            newAccountConfigurationCurrencies.list.forEach(function (element,index,array) {
                $http.post(environmentConfig.API + '/admin/groups/' + vm.groupName + '/account-configurations/' + $scope.accountConfigName + '/currencies/',{currency: element.code}, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 201) {
                        if (index === array.length - 1){
                            $timeout(function () {
                                $scope.newAccountConfigurationCurrencies = {
                                    list: []
                                };
                                $scope.loadingGroupAccountConfigurations = false;
                                toastr.success('Currencies has been successfully added');
                                $scope.getAccountConfigurationCurrencies();
                            },600);
                        }
                    }
                }).catch(function (error) {
                    $scope.loadingGroupAccountConfigurations = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            });
        };

        $scope.deleteAccountConfigurationCurrencyPrompt = function(currency) {
            $ngConfirm({
                title: 'Delete currency',
                content: "Are you sure you want to delete <b>" + currency.code + "</b> ?",
                animationBounce: 1,
                animationSpeed: 100,
                scope: $scope,
                buttons: {
                    close: {
                        text: "Cancel",
                        btnClass: 'btn-default dashboard-btn'
                    },
                    Add: {
                        text: "Delete",
                        btnClass: 'btn-danger dashboard-btn',
                        keys: ['enter'], // will trigger when enter is pressed
                        action: function(scope){
                            scope.deleteAccountConfigurationCurrency(currency);
                        }
                    }
                }
            });
        };

        $scope.deleteAccountConfigurationCurrency = function(currency){
            $scope.loadingGroupAccountConfigurations = true;
            $http.delete(environmentConfig.API + '/admin/groups/' + vm.groupName + '/account-configurations/' + $scope.accountConfigName + '/currencies/' + currency.code + '/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                if (res.status === 200) {
                    $timeout(function () {
                        $scope.loadingGroupAccountConfigurations = false;
                        toastr.success('Currency has been successfully deleted');
                        $scope.getAccountConfigurationCurrencies();
                    },600);
                }
            }).catch(function (error) {
                $scope.loadingGroupAccountConfigurations = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };


    }
})();
