(function () {
    'use strict';

    angular.module('BlurAdmin.pages.accounts')
        .controller('AccountsCtrl', AccountsCtrl);

    /** @ngInject */
    function AccountsCtrl($rootScope,$scope,localStorageManagement,typeaheadService,
                            errorHandler,serializeFiltersService,$uibModal,Rehive) {

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
            {colName: 'Account name',fieldName: 'name',visible: true},
            {colName: 'Reference',fieldName: 'reference',visible: true},
            {colName: 'Type',fieldName: 'primary',visible: true},
            {colName: 'Currencies',fieldName: 'currencies',visible: true}
        ];
        $scope.filtersObj = {
            nameFilter: false,
            primaryFilter: false,
            referenceFilter: false,
            userFilter: false
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
            }
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
            accountsArray.forEach(function (accountObj) {
                var currencyText = [];

                if(accountObj.currencies.length > 0){
                    accountObj.currencies.forEach(function (currencyObj,index,array) {
                        if(index == (array.length - 1)){
                            currencyText.push(currencyObj.currency.code);

                            $scope.accountsList.push({
                                user: accountObj.user.email,
                                name: accountObj.name,
                                reference: accountObj.reference,
                                primary: accountObj.primary ? 'primary': '',
                                currencies: currencyText.sort().join(', ')
                            });
                            $scope.$apply();
                        }

                        currencyText.push(currencyObj.currency.code);
                    });
                } else {
                    $scope.accountsList.push({
                        user: accountObj.user.email,
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

        $scope.displayAccount = function (user) {
            //$location.path('/user/' + user.identifier + '/details');
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
