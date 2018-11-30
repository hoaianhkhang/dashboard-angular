(function () {
    'use strict';

    angular.module('BlurAdmin.pages.accounts')
        .controller('AccountsCtrl', AccountsCtrl);

    /** @ngInject */
    function AccountsCtrl($rootScope,$scope,localStorageManagement,typeaheadService,
                          _,errorHandler,serializeFiltersService,$uibModal,Rehive,$filter) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        $rootScope.dashboardTitle = 'Accounts | Rehive';
        vm.companyIdentifier = localStorageManagement.getValue('companyIdentifier');
        vm.savedAccountsTableColumns = vm.companyIdentifier + 'accountsTable';
        $scope.accountsStateMessage = '';
        $scope.accountsList = [];
        $scope.accountsListData = {};
        $scope.showingFilters = false;
        $scope.showingColumnFilters = false;
        $scope.loadingAccounts = false;
        $scope.filtersCount = 0;

        $scope.accountsPagination = {
            itemsPerPage: 25,
            pageNo: 1,
            maxSize: 5
        };

        $scope.headerColumns = localStorageManagement.getValue(vm.savedAccountsTableColumns) ? JSON.parse(localStorageManagement.getValue(vm.savedAccountsTableColumns)) : [
            {colName: 'User',fieldName: 'user',visible: true},
            {colName: 'User group',fieldName: 'group',visible: false},
            {colName: 'Account name',fieldName: 'name',visible: true},
            {colName: 'Reference',fieldName: 'reference',visible: true},
            {colName: 'Type',fieldName: 'primary',visible: true},
            {colName: 'Currencies',fieldName: 'currencies',visible: true}
        ];
        $scope.filtersObj = {
            nameFilter: false,
            primaryFilter: false,
            referenceFilter: false,
            userFilter: false,
            balanceFilter: false,
            availableBalanceFilter: false
        };
        $scope.applyFiltersObj = {
            nameFilter: {
                selectedNameFilter: ''
            },
            primaryFilter: {
                selectedPrimaryFilter: false
            },
            referenceFilter: {
                selectedReferenceFilter: ''
            },
            userFilter: {
                selectedUserFilter: ''
            },
            balanceFilter: {
                selectedBalanceArray: []
            },
            availableBalanceFilter: {
                selectedAvailableBalanceArray: []
            }
        };

        vm.getCompanyCurrencies = function(){
            if(vm.token){
                Rehive.admin.currencies.get({filters: {
                    archived: false,
                    page_size: 250
                }}).then(function (res) {
                    $scope.currenciesOptions = res.results;
                    $scope.$apply();
                }, function (error) {
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.getCompanyCurrencies();

        $scope.showColumnFilters = function () {
            $scope.showingFilters = false;
            $scope.showingColumnFilters = !$scope.showingColumnFilters;
        };

        $scope.showFilters = function () {
            $scope.showingFilters = !$scope.showingFilters;
            $scope.showingColumnFilters = false;
        };

        $scope.selectAllColumns = function () {
            $scope.headerColumns.forEach(function (headerObj) {
                headerObj.visible = true;
            });
            localStorageManagement.setValue(vm.savedAccountsTableColumns,JSON.stringify($scope.headerColumns));
        };

        $scope.toggleColumnVisibility = function () {
            localStorageManagement.setValue(vm.savedAccountsTableColumns,JSON.stringify($scope.headerColumns));
        };

        $scope.restoreColDefaults = function () {
            var defaultVisibleHeader = ['User','Account name','Reference','Type',
                'Currencies'];

            $scope.headerColumns.forEach(function (headerObj) {
                if(defaultVisibleHeader.indexOf(headerObj.colName) > -1){
                    headerObj.visible = true;
                } else {
                    headerObj.visible = false;
                }
            });

            localStorageManagement.setValue(vm.savedAccountsTableColumns,JSON.stringify($scope.headerColumns));
        };

        $scope.getUsersEmailTypeahead = typeaheadService.getUsersEmailTypeahead();

        $scope.clearFilters = function () {
            $scope.filtersObj = {
                nameFilter: false,
                primaryFilter: false,
                referenceFilter: false,
                userFilter: false
            };
        };

        vm.getAccountsFiltersObj = function(){
            $scope.filtersCount = 0;

            for(var x in $scope.filtersObj){
                if($scope.filtersObj.hasOwnProperty(x)){
                    if($scope.filtersObj[x]){
                        $scope.filtersCount = $scope.filtersCount + 1;
                    }
                }
            }

            var searchObj = {
                page: $scope.accountsPagination.pageNo,
                page_size: $scope.filtersObj.pageSizeFilter? $scope.accountsPagination.itemsPerPage : 25,
                user: $scope.filtersObj.userFilter ? ($scope.applyFiltersObj.userFilter.selectedUserFilter ?  $scope.applyFiltersObj.userFilter.selectedUserFilter : null): null,
                reference: $scope.filtersObj.referenceFilter ?($scope.applyFiltersObj.referenceFilter.selectedReferenceFilter ? $scope.applyFiltersObj.referenceFilter.selectedReferenceFilter : null): null,
                name: $scope.filtersObj.nameFilter ? ($scope.applyFiltersObj.nameFilter.selectedNameFilter ? $scope.applyFiltersObj.nameFilter.selectedNameFilter : null): null,
                primary: $scope.filtersObj.primaryFilter ? $scope.filtersObj.primaryFilter : null
            };

            return serializeFiltersService.objectFilters(searchObj);
        };

        $scope.getAllAccounts = function(applyFilter){
            $scope.accountsStateMessage = '';
            $scope.loadingAccounts = true;
            $scope.showingFilters = false;

            if(applyFilter){
                $scope.accountsPagination.pageNo = 1;
            }

            if($scope.accountsList.length > 0 ){
                $scope.accountsList.length = 0;
            }

            var accountsFiltersObj = vm.getAccountsFiltersObj();

            Rehive.admin.accounts.get({filters: accountsFiltersObj}).then(function (res) {
                $scope.accountsListData = res;
                if(res.results.length > 0){
                    console.log(res.results)
                    vm.formatAccountsArray(res.results);
                } else {
                    $scope.accountsList = [];
                    $scope.loadingAccounts = false;
                    $scope.$apply();
                }

                if($scope.accountsList.length == 0){
                    $scope.accountsStateMessage = 'No accounts have been found';
                    $scope.loadingAccounts = false;
                    $scope.$apply();
                    return;
                }
                $scope.accountsStateMessage = '';
                $scope.$apply();
            }, function (error) {
                $scope.loadingAccounts = false;
                $scope.accountsStateMessage = 'Failed to load data';
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };
        $scope.getAllAccounts();

        vm.formatAccountsArray = function (accountsArray) {

            // inserting currency balance and available balance of first account obj and its first currency object
            if(accountsArray[0].currencies && accountsArray[0].currencies.length > 0){
                var headerColumnsExist = false;
                $scope.headerColumns.forEach(function (header) {
                    if((accountsArray[0].currencies[0].currency.code + 'balance') === header.fieldName){
                        headerColumnsExist = true;
                    }
                });

                if(!headerColumnsExist){
                    $scope.headerColumns.push({colName: accountsArray[0].currencies[0].currency.code + ' balance',fieldName:  accountsArray[0].currencies[0].currency.code + 'balance',visible: true});
                    $scope.headerColumns.push({colName: accountsArray[0].currencies[0].currency.code + ' available balance',fieldName: accountsArray[0].currencies[0].currency.code + 'availableBalance',visible: true});
                }
            }

            accountsArray.forEach(function (accountObj) {
                var currencyText = [];
                var currencyBalanceAndAvailableBalanceObject = {};

                if(accountObj.currencies.length > 0){
                    accountObj.currencies.forEach(function (currencyObj,index,array) {
                        if(index == (array.length - 1)){

                            currencyBalanceAndAvailableBalanceObject[currencyObj.currency.code + 'balance'] = $filter("currencyModifiersFilter")(currencyObj.balance,currencyObj.currency.divisibility);
                            currencyBalanceAndAvailableBalanceObject[currencyObj.currency.code + 'availableBalance'] = $filter("currencyModifiersFilter")(currencyObj.available_balance,currencyObj.currency.divisibility);
                            currencyText.push(currencyObj.currency.code);

                            var accountObject = {};

                            accountObject = {
                                user: accountObj.user.email ? accountObj.user.email : accountObj.user.mobile ? accountObj.user.mobile : accountObj.user.id,
                                group: accountObj.user.group || '',
                                name: accountObj.name,
                                reference: accountObj.reference,
                                primary: accountObj.primary ? 'primary': '',
                                currencies: currencyText.sort().join(', ')
                            };

                            accountObject = _.extend(accountObject,currencyBalanceAndAvailableBalanceObject);

                            $scope.accountsList.push(accountObject);

                            $scope.$apply();
                        }

                        currencyBalanceAndAvailableBalanceObject[currencyObj.currency.code + 'balance'] = $filter("currencyModifiersFilter")(currencyObj.balance,currencyObj.currency.divisibility);
                        currencyBalanceAndAvailableBalanceObject[currencyObj.currency.code + 'availableBalance'] = $filter("currencyModifiersFilter")(currencyObj.available_balance,currencyObj.currency.divisibility);
                        currencyText.push(currencyObj.currency.code);
                    });
                } else {
                    $scope.accountsList.push({
                        user: accountObj.user.email ? accountObj.user.email : accountObj.user.mobile ? accountObj.user.mobile : accountObj.user.id,
                        group: accountObj.user.group || '',
                        name: accountObj.name,
                        reference: accountObj.reference,
                        primary: accountObj.primary ? 'primary': '',
                        currencies: ''
                    });
                    $scope.$apply();
                }
            });

            $scope.loadingAccounts = false;
        };

        $scope.displayAccount = function (page,size,account) {
            vm.theAccountModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'ShowAccountModalCtrl',
                scope: $scope,
                resolve: {
                    account: function () {
                        return account;
                    }
                }
            });

            vm.theAccountModal.result.then(function(){

            }, function(){
            });
        };

        $scope.goToAddAccount = function (page,size) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'NewAccountModalCtrl',
                scope: $scope
            });

            vm.theModal.result.then(function(account){
                if(account){
                    $scope.getAllAccounts('applyFilter');
                }
            }, function(){
            });
        };

        $scope.closeColumnFiltersBox = function () {
            $scope.showingColumnFilters = false;
        };

    }
})();
