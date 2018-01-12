(function () {
    'use strict';

    angular.module('BlurAdmin.pages.group.accountConfiguration')
        .controller('GroupAccountConfigurationCtrl', GroupAccountConfigurationCtrl);

    /** @ngInject */
    function GroupAccountConfigurationCtrl($scope,environmentConfig,$http,$stateParams,$ngConfirm,$timeout,
                                            cookieManagement,errorHandler,toastr,serializeFiltersService) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
        vm.groupName = $stateParams.groupName;
        $scope.accountConfigName =  $stateParams.accountConfigName;
        $scope.loadingGroupAccountConfigurationCurrencies = true;
        $scope.newAccountConfigurationCurrencies = {
            list: []
        };
        $scope.groupAccountConfigurationCurrenciesList = [];
        $scope.currenciesList = [];

        $scope.pagination = {
            itemsPerPage: 10,
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
                $scope.loadingGroupAccountConfigurationCurrencies = true;

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
                    $scope.loadingGroupAccountConfigurationCurrencies = false;
                    if (res.status === 200) {
                        $scope.groupAccountConfigurationCurrenciesData = res.data.data;
                        $scope.groupAccountConfigurationCurrenciesList = res.data.data.results;
                    }
                }).catch(function (error) {
                    $scope.loadingGroupAccountConfigurationCurrencies = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        $scope.getAccountConfigurationCurrencies();

        $scope.addGroupAccountConfigurationCurrency = function (newAccountConfigurationCurrencies) {
            $scope.loadingGroupAccountConfigurationCurrencies = true;
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
                                $scope.loadingGroupAccountConfigurationCurrencies = false;
                                toastr.success('Currencies has been successfully added');
                                $scope.getAccountConfigurationCurrencies();
                            },600);
                        }
                    }
                }).catch(function (error) {
                    $scope.loadingGroupAccountConfigurationCurrencies = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            })
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
                            scope.deleteAccountConfigurationCurrency(currency)
                        }
                    }
                }
            });
        };

        $scope.deleteAccountConfigurationCurrency = function(currency){
            $scope.loadingGroupAccountConfigurationCurrencies = true;
            $http.delete(environmentConfig.API + '/admin/groups/' + vm.groupName + '/account-configurations/' + $scope.accountConfigName + '/currencies/' + currency.code + '/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                if (res.status === 200) {
                    $timeout(function () {
                        $scope.loadingGroupAccountConfigurationCurrencies = false;
                        toastr.success('Currency has been successfully deleted');
                        $scope.getAccountConfigurationCurrencies();
                    },600);
                }
            }).catch(function (error) {
                $scope.loadingGroupAccountConfigurationCurrencies = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

    }
})();
