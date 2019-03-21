(function () {
    'use strict';

    angular.module('BlurAdmin.pages.accounts')
        .controller('AccountsCtrl', AccountsCtrl);

    /** @ngInject */
    function AccountsCtrl($rootScope,$scope,localStorageManagement,typeaheadService,compareArrayOfObjects,
                          _,errorHandler,serializeFiltersService,$uibModal,Rehive,$filter, $intercom, $state) {

        $intercom.update({});
        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        $rootScope.dashboardTitle = 'Accounts | Rehive';
        vm.companyIdentifier = localStorageManagement.getValue('companyIdentifier');
        vm.savedAccountsTableColumns = vm.companyIdentifier + 'accountsTable';
        vm.savedAccountsTableFilters = vm.companyIdentifier + 'accountsTableFilters';
        vm.savedGroupColors = [];
        vm.companyColors = localStorageManagement.getValue('companyIdentifier') + "_group_colors";
        $scope.initialLoad = true;
        $scope.accountsStateMessage = '';
        $scope.accountsList = [];
        $scope.accountsListData = {};
        $scope.showingFilters = false;
        $scope.showingColumnFilters = false;
        $scope.loadingAccounts = false;
        $scope.filtersCount = 0;
        $scope.groupOptions = [];
        $scope.insertingBalanceCurrencyFromHeader = false;
        $scope.insertingAvailableBalanceCurrencyFromHeader = false;
        $scope.availableBalanceColumn = true;
        $scope.balanceColumn = true;

        $scope.accountsPagination = {
            itemsPerPage: 25,
            pageNo: 1,
            maxSize: 5
        };

        $scope.headerColumns = localStorageManagement.getValue(vm.savedAccountsTableColumns) ? JSON.parse(localStorageManagement.getValue(vm.savedAccountsTableColumns)) : [
            {colName: 'User',fieldName: 'user',visible: true},
            {colName: 'User group',fieldName: 'group',visible: true},
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
            groupFilter: false
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
            groupFilter: {
                selectedUserGroup: {}
            }
        };
        $scope.columnFiltersObj = {
            balanceArray: [],
            availableBalanceArray: []
        };

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
                userFilter: false,
                groupFilter: false
            };
        };

        vm.getAccountsFiltersObj = function(){
           $scope.filtersCount = 0;
            var searchObj = {};
            var filterObjects = {};

            if($scope.initialLoad) {
                $scope.initialLoad = false;
                if (localStorageManagement.getValue(vm.savedAccountsTableFilters)) {
                    filterObjects = JSON.parse(localStorageManagement.getValue(vm.savedAccountsTableFilters));

                    $scope.filtersObj = filterObjects.filtersObj;

                    $scope.applyFiltersObj = {
                        nameFilter: {
                            selectedNameFilter: filterObjects.applyFiltersObj.nameFilter.selectedNameFilter
                        },
                        primaryFilter: {
                            selectedPrimaryFilter: filterObjects.applyFiltersObj.primaryFilter.selectedPrimaryFilter
                        },
                        referenceFilter: {
                            selectedReferenceFilter: filterObjects.applyFiltersObj.referenceFilter.selectedReferenceFilter
                        },
                        userFilter: {
                            selectedUserFilter: filterObjects.applyFiltersObj.userFilter.selectedUserFilter
                        },
                        groupFilter: {
                            selectedUserGroup:
                                filterObjects.applyFiltersObj.groupFilter.selectedUserGroup ?
                                    $scope.groupOptions.find(function(group){
                                        if(group.name === filterObjects.applyFiltersObj.groupFilter.selectedUserGroup.name){
                                            return group;
                                        }
                                    }) : $scope.groupOptions[0]
                        }
                    };
                    searchObj = filterObjects.searchObj;

                } else {
                    searchObj = {
                        page: 1,
                        page_size: $scope.filtersObj.pageSizeFilter? $scope.applyFiltersObj.paginationFilter.itemsPerPage : 25
                    };
                }
            } else {

                searchObj = {
                    page: $scope.accountsPagination.pageNo,
                    page_size: $scope.filtersObj.pageSizeFilter? $scope.accountsPagination.itemsPerPage : 25,
                    user: $scope.filtersObj.userFilter ? ($scope.applyFiltersObj.userFilter.selectedUserFilter ?  $scope.applyFiltersObj.userFilter.selectedUserFilter : null): null,
                    reference: $scope.filtersObj.referenceFilter ?($scope.applyFiltersObj.referenceFilter.selectedReferenceFilter ? $scope.applyFiltersObj.referenceFilter.selectedReferenceFilter : null): null,
                    name: $scope.filtersObj.nameFilter ? ($scope.applyFiltersObj.nameFilter.selectedNameFilter ? $scope.applyFiltersObj.nameFilter.selectedNameFilter : null): null,
                    primary: $scope.filtersObj.primaryFilter ? $scope.filtersObj.primaryFilter : null,
                    group: $scope.filtersObj.groupFilter ? $scope.applyFiltersObj.groupFilter.selectedUserGroup.name: null
                };

                vm.saveAccountsTableFiltersToLocalStorage({
                    searchObj: serializeFiltersService.objectFilters(searchObj),
                    filtersObj: $scope.filtersObj,
                    applyFiltersObj: $scope.applyFiltersObj
                });

            }

            console.log(searchObj);
            for(var x in $scope.filtersObj){
                if($scope.filtersObj.hasOwnProperty(x)){
                    if($scope.filtersObj[x]){
                        $scope.filtersCount = $scope.filtersCount + 1;
                    }
                }
            }
            return serializeFiltersService.objectFilters(searchObj);
        };

        vm.saveAccountsTableFiltersToLocalStorage = function (filterObjects) {
            localStorageManagement.setValue(vm.savedAccountsTableFilters,JSON.stringify(filterObjects));
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

        if($state.params.accountRef){
            $scope.clearFilters();
            $scope.filtersObj.referenceFilter = true;
            $scope.applyFiltersObj.referenceFilter.selectedReferenceFilter = $state.params.accountRef;

            var filtersObj = localStorageManagement.getValue(vm.savedAccountsTableFilters) ? JSON.parse(localStorageManagement.getValue(vm.savedAccountsTableFilters)) : {};

            if(filtersObj === {}){
                filtersObj.searchObj = {};
                filtersObj.applyFiltersObj = $scope.applyFiltersObj;
            }

            filtersObj.searchObj.reference = $state.params.accountRef;
            filtersObj.applyFiltersObj.referenceFilter.selectedReferenceFilter = $state.params.accountRef;

            vm.saveAccountsTableFiltersToLocalStorage({
                searchObj: serializeFiltersService.objectFilters(filtersObj.searchObj),
                filtersObj: $scope.filtersObj,
                applyFiltersObj: serializeFiltersService.objectFilters(filtersObj.applyFiltersObj)
            });

            $scope.getAllAccounts('applyFilter');

        } else if($state.params.email) {
            $scope.clearFilters();
            $scope.filtersObj.userFilter = true;
            $scope.applyFiltersObj.userFilter.selectedUserFilter = $state.params.email;

            var filtersObj = localStorageManagement.getValue(vm.savedAccountsTableFilters) ? JSON.parse(localStorageManagement.getValue(vm.savedAccountsTableFilters)) : {};

            if(filtersObj === {}){
                filtersObj.searchObj = {};
                filtersObj.applyFiltersObj = $scope.applyFiltersObj;
            }

            filtersObj.searchObj.user = $state.params.email;
            filtersObj.applyFiltersObj.userFilter.selectedUserFilter = $state.params.email;

            vm.saveAccountsTableFiltersToLocalStorage({
                searchObj: serializeFiltersService.objectFilters(filtersObj.searchObj),
                filtersObj: $scope.filtersObj,
                applyFiltersObj: serializeFiltersService.objectFilters(filtersObj.applyFiltersObj)
            });
            $scope.getAllAccounts('applyFilter');

        } else {
            $scope.getAllAccounts(null);
        }

        $scope.getGroups = function () {
            if(vm.token) {
                Rehive.admin.groups.get({filters: {page_size: 250}}).then(function (res) {
                    if(res.results.length > 0){
                        $scope.groupOptions = res.results;
                        $scope.applyFiltersObj.groupFilter.selectedUserGroup = $scope.groupOptions[0];
                    }
                    $scope.$apply();
                }, function (error) {
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        $scope.getGroups();

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

        vm.getCurrencyHeaderColumns = function (firstAccountInList) {
            // inserting currency balance and available balance of first account obj
            // and its first currency object in headers and columns
            // if header has no balance or available balance fields
            if(firstAccountInList.currencies && firstAccountInList.currencies.length > 0){
                var fieldNameArray = _.pluck($scope.headerColumns,'fieldName');
                var balanceArray = fieldNameArray.filter(function (field) {
                    if(field.indexOf('balance') > 0){ return true; }
                });
                var availableBalanceArray = fieldNameArray.filter(function (field) {
                    if(field.indexOf('availableBalance') > 0){ return true; }
                });

                if(balanceArray.length === 0){
                    // if($scope.currenciesOptions.length > 0){
                    //     $scope.currenciesOptions.forEach(function (currency) {
                    //         if(currency.code === firstAccountInList.currencies[0].currency.code){
                    //             if($scope.columnFiltersObj.balanceArray === undefined){
                    //                 $scope.columnFiltersObj.balanceArray = [];
                    //             }
                    //             $scope.columnFiltersObj.balanceArray.push(currency);
                    //         }
                    //     });
                    // }

                    if($scope.columnFiltersObj.balanceArray === undefined){
                        $scope.columnFiltersObj.balanceArray = [];
                    }
                    $scope.columnFiltersObj.balanceArray.push(firstAccountInList.currencies[0].currency);
                } else {
                    if(balanceArray){
                        balanceArray.forEach(function (balanceCurrency) {
                            $scope.currenciesOptions.forEach(function (currency) {
                                if(currency.code === balanceCurrency.replace('balance','')){
                                    $scope.insertingBalanceCurrencyFromHeader = true;
                                    $scope.columnFiltersObj.balanceArray.push(currency);
                                }
                            });
                        });
                    }
                }

                if(availableBalanceArray.length === 0){
                    // if($scope.currenciesOptions.length > 0){
                    //     $scope.currenciesOptions.forEach(function (currency) {
                    //         if(currency.code === firstAccountInList.currencies[0].currency.code){
                    //             if($scope.columnFiltersObj.availableBalanceArray === undefined){
                    //                 $scope.columnFiltersObj.availableBalanceArray = [];
                    //             }
                    //             $scope.columnFiltersObj.availableBalanceArray.push(currency);
                    //         }
                    //     });
                    // }

                    if($scope.columnFiltersObj.availableBalanceArray === undefined){
                        $scope.columnFiltersObj.availableBalanceArray = [];
                    }
                    $scope.columnFiltersObj.availableBalanceArray.push(firstAccountInList.currencies[0].currency);
                } else {
                   if(availableBalanceArray){
                       availableBalanceArray.forEach(function (availableBalanceCurrency) {
                           $scope.currenciesOptions.forEach(function (currency) {
                               if(currency.code === availableBalanceCurrency.replace('availableBalance','')){
                                   $scope.insertingAvailableBalanceCurrencyFromHeader = true;
                                   $scope.columnFiltersObj.availableBalanceArray.push(currency);
                               }
                           });
                       });
                   }
                }
            }
        };

        vm.initializeGroupColor = function(userGroupName){
            if(userGroupName === null || userGroupName === ''){return "#022b36";}
            var idx = -1;
            vm.savedGroupColors = localStorageManagement.getValue(vm.companyColors) ? JSON.parse(localStorageManagement.getValue(vm.companyColors)) : [];
            vm.savedGroupColors.forEach(function(color){
                console.log(color.group, userGroupName);
                if(color.group == userGroupName){
                    idx = vm.savedGroupColors.indexOf(color);
                    return;
                }
            });
            console.log(idx);
            return (idx === -1) ? "#022b36" : vm.savedGroupColors[idx].color;
        };

        vm.formatAccountsArray = function (accountsArray) {

            if(accountsArray.length === 0){
                $scope.loadingAccounts = false;
                return false;
            }

            vm.getCurrencyHeaderColumns(accountsArray[0]);

            accountsArray.forEach(function (accountObj) {
                var currencyText = [];
                var currencyBalanceAndAvailableBalanceObject = {};

                if(accountObj.currencies.length > 0){
                    accountObj.currencies.forEach(function (currencyObj,index,array) {
                        if(index == (array.length - 1)){

                            currencyBalanceAndAvailableBalanceObject[currencyObj.currency.code + 'balance'] = $filter("currencyModifiersFilter")(currencyObj.balance,currencyObj.currency.divisibility);
                            currencyBalanceAndAvailableBalanceObject[currencyObj.currency.code + 'availableBalance'] = $filter("currencyModifiersFilter")(currencyObj.available_balance,currencyObj.currency.divisibility);
                            currencyText.push(currencyObj.currency.code);

                            var userGroup = accountObj.user.groups.length > 0 ? ((accountObj.user.groups[0].name === "service") ? "extension" : accountObj.user.groups[0].name) : '';
                            var group_highlight_color = null;
                            if(userGroup != "admin" && userGroup != "extension"){
                                group_highlight_color = vm.initializeGroupColor(userGroup);
                            }
                            var accountObject = {
                                user: accountObj.user.email ? accountObj.user.email : accountObj.user.mobile ? accountObj.user.mobile : accountObj.user.id,
                                group: userGroup,
                                name: accountObj.name,
                                reference: accountObj.reference,
                                primary: accountObj.primary ? 'primary': '',
                                currencies: currencyText.sort().join(', '),
                                group_highlight_color: group_highlight_color
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
                        group: accountObj.user.groups.length > 0 ? ((accountObj.user.groups[0].name === "service") ? "extension" : accountObj.user.groups[0].name) : '',
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

        $scope.$watchCollection("columnFiltersObj.balanceArray", function( newValue, oldValue ) {
            if($scope.insertingBalanceCurrencyFromHeader){
                $scope.insertingBalanceCurrencyFromHeader = false;
            } else {
                if(newValue === undefined){
                    newValue = [];
                }

                if(oldValue === undefined){
                    oldValue = [];
                }

                var objectAdded = false;
                if(newValue.length > oldValue.length){
                    objectAdded = true;
                } else {
                    objectAdded = false;
                }

                var changedObjectArray = compareArrayOfObjects.differentElem(newValue, oldValue);

                if(changedObjectArray && changedObjectArray.length > 0){
                    if(objectAdded){
                        $scope.headerColumns.push({colName: changedObjectArray[0].code + ' balance',fieldName:  changedObjectArray[0].code + 'balance',visible: true});
                        localStorageManagement.setValue(vm.savedAccountsTableColumns,JSON.stringify($scope.headerColumns));
                    } else {
                        $scope.headerColumns.forEach(function (header,index) {
                            if(header.fieldName === (changedObjectArray[0].code + 'balance')){
                                $scope.headerColumns.splice(index,1);
                                localStorageManagement.setValue(vm.savedAccountsTableColumns,JSON.stringify($scope.headerColumns));
                            }
                        });
                    }
                }
            }
        },true);

        $scope.$watchCollection("columnFiltersObj.availableBalanceArray", function( newValue, oldValue ) {
            if($scope.insertingAvailableBalanceCurrencyFromHeader) {
                $scope.insertingAvailableBalanceCurrencyFromHeader = false;
            } else {
                if(newValue === undefined){
                    newValue = [];
                }

                if(oldValue === undefined){
                    oldValue = [];
                }

                var objectAdded = false;
                if(newValue.length > oldValue.length){
                    objectAdded = true;
                } else {
                    objectAdded = false;
                }

                var changedObjectArray = compareArrayOfObjects.differentElem(newValue, oldValue);

                if(changedObjectArray && changedObjectArray.length > 0){
                    if(objectAdded){
                        $scope.headerColumns.push({colName: changedObjectArray[0].code + ' available balance',fieldName:  changedObjectArray[0].code + 'availableBalance',visible: true});
                        localStorageManagement.setValue(vm.savedAccountsTableColumns,JSON.stringify($scope.headerColumns));
                    } else {
                        $scope.headerColumns.forEach(function (header,index) {
                            if(header.fieldName === (changedObjectArray[0].code + 'availableBalance')){
                                $scope.headerColumns.splice(index,1);
                                localStorageManagement.setValue(vm.savedAccountsTableColumns,JSON.stringify($scope.headerColumns));
                            }
                        });
                    }
                }
            }
        },true);

    }
})();
