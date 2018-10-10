(function () {
    'use strict';

    angular.module('BlurAdmin.pages.transactions.history')
        .controller('HistoryCtrl', HistoryCtrl);

    /** @ngInject */
    function HistoryCtrl($rootScope,Rehive,$scope,localStorageManagement,$uibModal,sharedResources,
                         toastr,currencyModifiers,errorHandler,$state,$window,typeaheadService,$filter,
                         serializeFiltersService,$location,_) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        vm.companyIdentifier = localStorageManagement.getValue('companyIdentifier');
        $scope.companyDateFormatString = localStorageManagement.getValue('DATE_FORMAT');
        vm.savedTransactionTableColumns = vm.companyIdentifier + 'transactionsTable';
        vm.newTransactionParams = $location.search();
        $rootScope.dashboardTitle = 'Transactions history | Rehive';
        vm.currenciesList = JSON.parse($window.sessionStorage.currenciesList || '[]');
        $scope.showingFilters = false;
        $scope.showingColumnFilters = false;
        $scope.dateFilterOptions = ['Is in the last','In between','Is equal to','Is after','Is before'];
        $scope.amountFilterOptions = ['Is equal to','Is between','Is greater than','Is less than'];
        $scope.referenceFilterOptions = ['Is equal to','Is between','Is greater than','Is less than'];
        $scope.dateFilterIntervalOptions = ['days','months'];
        $scope.groupFilterOptions = ['Group name','In a group'];
        $scope.accountFilterOptions = ['Name','Reference'];
        $scope.visibleColumnsArray = [];
        $scope.visibleColumnsSelectionChanged = false;
        $scope.filtersCount = 0;

        // if(localStorageManagement.getValue(vm.savedTransactionTableColumns)){
        //     var headerColumns = JSON.parse(localStorageManagement.getValue(vm.savedTransactionTableColumns));
        //     var recipientFieldExists = false;
        //     headerColumns.forEach(function (col) {
        //         if(col.colName == 'Recipient' || col.fieldName == 'recipient'){
        //             recipientFieldExists = true;
        //         }
        //     });
        //
        //     if(!recipientFieldExists){
        //         headerColumns.splice(1,0,{colName: 'Recipient',fieldName: 'recipient',visible: true});
        //     }
        //
        //     localStorageManagement.setValue(vm.savedTransactionTableColumns,JSON.stringify(headerColumns));
        // }

        if(localStorageManagement.getValue(vm.savedTransactionTableColumns)){
                 var headerColumns = JSON.parse(localStorageManagement.getValue(vm.savedTransactionTableColumns));
                 headerColumns.forEach(function (col) {
                     if(col.colName == 'Identifier'){
                         col.colName = 'User id';
                         col.fieldName = 'userId';
                     }
                 });

                localStorageManagement.setValue(vm.savedTransactionTableColumns,JSON.stringify(headerColumns));
            }

        $scope.headerColumns = localStorageManagement.getValue(vm.savedTransactionTableColumns) ? JSON.parse(localStorageManagement.getValue(vm.savedTransactionTableColumns)) : [
            {colName: 'User',fieldName: 'user',visible: true},
            {colName: 'Recipient',fieldName: 'recipient',visible: true},
            {colName: 'Type',fieldName: 'tx_type',visible: true},
            {colName: 'Subtype',fieldName: 'subtype',visible: true},
            {colName: 'Currency',fieldName: 'currencyCode',visible: true},
            {colName: 'Amount',fieldName: 'amount',visible: true},
            {colName: 'Fee',fieldName: 'fee',visible: true},
            {colName: 'Status',fieldName: 'status',visible: true},
            {colName: 'Id',fieldName: 'id',visible: true},
            {colName: 'Date',fieldName: 'createdDate',visible: true},
            {colName: 'Total amount',fieldName: 'totalAmount',visible: false},
            {colName: 'Balance',fieldName: 'balance',visible: false},
            {colName: 'Account',fieldName: 'account',visible: false},
            {colName: 'Username',fieldName: 'username',visible: false},
            {colName: 'User id',fieldName: 'userId',visible: false},
            {colName: 'Updated',fieldName: 'updatedDate',visible: false},
            {colName: 'Mobile',fieldName: 'mobile',visible: false},
            {colName: 'Destination tx id',fieldName: 'destination_tx_id',visible: false},
            {colName: 'Source tx id',fieldName: 'source_tx_id',visible: false},
            {colName: 'Label',fieldName: 'label',visible: false},
            {colName: 'Reference',fieldName: 'reference',visible: false},
            {colName: 'Note',fieldName: 'note',visible: false}
        ];
        $scope.filtersObj = {
            dateFilter: false,
            amountFilter: false,
            statusFilter: false,
            transactionTypeFilter: false,
            transactionSubtypeFilter: false,
            transactionIdFilter: false,
            destinationIdFilter: false,
            sourceIdFilter: false,
            referenceFilter: false,
            userFilter: false,
            accountFilter: false,
            groupFilter: false,
            currencyFilter: false,
            pageSizeFilter: false,
            orderByFilter: false
        };
        $scope.applyFiltersObj = {
            dateFilter: {
                selectedDateOption: 'Is in the last',
                selectedDayIntervalOption: 'days',
                dayInterval: '',
                dateFrom: '',
                dateTo: '',
                dateEqualTo: ''
            },
            amountFilter: {
                selectedAmountOption: 'Is equal to',
                amount: null,
                amount__lt: null,
                amount__gt: null
            },
            statusFilter: {
                selectedStatusOption: 'Pending'
            },
            transactionTypeFilter: {
                selectedTransactionTypeOption: 'Credit'
            },
            transactionSubtypeFilter: {
                selectedTransactionSubtypeOption: ''
            },
            transactionIdFilter: {
                selectedTransactionIdOption: null
            },
            referenceFilter: {
                selectedReferenceOption: 'Is equal to',
                reference: null,
                reference__lt: null,
                reference__gt: null
            },
            userFilter: {
                selectedUserOption: null
            },
            accountFilter: {
                selectedAccountOption: 'Name',
                selectedAccountName: null,
                selectedAccountReference: null
            },
            groupFilter: {
                selectedGroupOption: 'Group name',
                existsInGroup: false,
                selectedGroup: {}
            },
            currencyFilter:{
                selectedCurrencyOption: {}
            },
            orderByFilter: {
                selectedOrderByOption: 'Latest'
            }
        };
        $scope.pagination = {
            itemsPerPage: 25,
            pageNo: 1,
            maxSize: 5
        };
        vm.location = $location.path();
        vm.locationArray = vm.location.split('/');
        $scope.locationIndicator = vm.locationArray[vm.locationArray.length - 1];
        $scope.transactions = [];
        $scope.transactionsStateMessage = '';
        $scope.transactionsData = {};
        $scope.loadingTransactions = false;
        $scope.typeOptions = ['Credit','Debit']; //Transfer
        $scope.statusOptions = ['Pending','Complete','Failed','Deleted'];
        $scope.currencyOptions = [];
        $scope.orderByOptions = ['Latest','Largest','Smallest'];
        $scope.groupOptions = [];

        $scope.showColumnFilters = function () {
            $scope.showingFilters = false;
            $scope.showingColumnFilters = !$scope.showingColumnFilters;
        };

        $scope.selectAllColumns = function () {
            $scope.headerColumns.forEach(function (headerObj) {
                headerObj.visible = true;
            });
            localStorageManagement.setValue(vm.savedTransactionTableColumns,JSON.stringify($scope.headerColumns));
        };

        $scope.toggleColumnVisibility = function () {
            $scope.visibleColumnsSelectionChanged = true;
            localStorageManagement.setValue(vm.savedTransactionTableColumns,JSON.stringify($scope.headerColumns));
        };

        $scope.restoreColDefaults = function () {
            var defaultVisibleHeader = ['User','Type','Subtype','Currency',
                'Amount','Fee','Status','Date','Id'];

            $scope.headerColumns.forEach(function (headerObj) {
                if(defaultVisibleHeader.indexOf(headerObj.colName) > -1){
                    headerObj.visible = true;
                } else {
                    headerObj.visible = false;
                }
            });

            localStorageManagement.setValue(vm.savedTransactionTableColumns,JSON.stringify($scope.headerColumns));
        };

        sharedResources.getSubtypes().then(function (res) {
            $scope.subtypeOptions = _.pluck(res,'name');
            $scope.subtypeOptions.unshift('');
        });

        $scope.getGroups = function () {
            if(vm.token) {
                Rehive.admin.groups.get({filters: {page_size: 250}}).then(function (res) {
                    if(res.results.length > 0){
                        $scope.groupOptions = res.results;
                        $scope.applyFiltersObj.groupFilter.selectedGroup = $scope.groupOptions[0];
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

        //for angular datepicker
        $scope.dateObj = {};
        $scope.dateObj.format = $scope.companyDateFormatString;
        $scope.popup1 = {};
        $scope.open1 = function() {
            $scope.popup1.opened = true;
        };

        $scope.popup2 = {};
        $scope.open2 = function() {
            $scope.popup2.opened = true;
        };

        //end angular datepicker

        $scope.orderByFunction = function () {
            return ($scope.applyFiltersObj.orderByFilter.selectedOrderByOption == 'Latest' ? '-created' :
                $scope.applyFiltersObj.orderByFilter.selectedOrderByOption == 'Largest' ? '-amount' :
                    $scope.applyFiltersObj.orderByFilter.selectedOrderByOption == 'Smallest' ? 'amount' : '');
        };

        $scope.pageSizeChanged =  function () {
            if($scope.pagination.itemsPerPage > 10000){
                $scope.pagination.itemsPerPage = 10000;
            }
        };

        vm.getCompanyCurrencies = function(){
            //adding currency as default value in both results array and ng-model of currency
            $scope.applyFiltersObj.currencyFilter.selectedCurrencyOption = vm.currenciesList[0];
            $scope.currencyOptions = vm.currenciesList;
        };
        vm.getCompanyCurrencies();

        if($state.params.currencyCode){
            $scope.filtersObj.currencyFilter = true;
            vm.currenciesList.forEach(function (element) {
                if(element.code == $state.params.currencyCode){
                    $scope.applyFiltersObj.currencyFilter.selectedCurrencyOption = element;
                }
            });
        }

        $scope.showFilters = function () {
            $scope.showingFilters = !$scope.showingFilters;
            $scope.showingColumnFilters = false;
        };

        $scope.clearFilters = function () {
            $scope.filtersObj = {
                dateFilter: false,
                amountFilter: false,
                statusFilter: false,
                transactionTypeFilter: false,
                transactionSubtypeFilter: false,
                transactionIdFilter: false,
                destinationIdFilter: false,
                sourceIdFilter: false,
                userFilter: false,
                groupFilter: false,
                currencyFilter: false,
                pageSizeFilter: false,
                orderByFilter: false
            };
        };

        $scope.dayIntervalChanged = function () {
            if($scope.applyFiltersObj.dateFilter.dayInterval <= 0){
                toastr.success('Please enter a positive value');
            }
        };

        vm.getDateFilters = function () {
            var dateObj = {
                created__lt: null,
                created__gt: null
            };

            switch($scope.applyFiltersObj.dateFilter.selectedDateOption) {
                case 'Is in the last':
                    if($scope.applyFiltersObj.dateFilter.selectedDayIntervalOption == 'days'){
                        dateObj.created__lt = moment().add(1,'days').format('YYYY-MM-DD');
                        dateObj.created__gt = moment().subtract($scope.applyFiltersObj.dateFilter.dayInterval,'days').format('YYYY-MM-DD');
                    } else {
                        dateObj.created__lt = moment().add(1,'days').format('YYYY-MM-DD');
                        dateObj.created__gt = moment().subtract($scope.applyFiltersObj.dateFilter.dayInterval,'months').format('YYYY-MM-DD');
                    }

                    break;
                case 'In between':
                    dateObj.created__lt = moment(new Date($scope.applyFiltersObj.dateFilter.dateTo)).add(1,'days').format('YYYY-MM-DD');
                    dateObj.created__gt = moment(new Date($scope.applyFiltersObj.dateFilter.dateFrom)).format('YYYY-MM-DD');

                    break;
                case 'Is equal to':
                    dateObj.created__lt = moment(new Date($scope.applyFiltersObj.dateFilter.dateEqualTo)).add(1,'days').format('YYYY-MM-DD');
                    dateObj.created__gt = moment(new Date($scope.applyFiltersObj.dateFilter.dateEqualTo)).format('YYYY-MM-DD');

                    break;
                case 'Is after':
                    dateObj.created__lt = null;
                    dateObj.created__gt = moment(new Date($scope.applyFiltersObj.dateFilter.dateFrom)).add(1,'days').format('YYYY-MM-DD');
                    break;
                case 'Is before':
                    dateObj.created__lt = moment(new Date($scope.applyFiltersObj.dateFilter.dateTo)).format('YYYY-MM-DD');
                    dateObj.created__gt = null;
                    break;
                default:
                    break;
            }

            return dateObj;
        };

        vm.getAmountFilters = function () {
            var amountObj = {
                amount: null,
                amount__lt: null,
                amount__gt: null
            };

            switch($scope.applyFiltersObj.amountFilter.selectedAmountOption) {
                case 'Is equal to':
                    amountObj = {
                        amount: $scope.applyFiltersObj.amountFilter.amount,
                        amount__lt: null,
                        amount__gt: null
                    };

                    break;
                case 'Is between':
                    amountObj = {
                        amount: null,
                        amount__lt: $scope.applyFiltersObj.amountFilter.amount__lt,
                        amount__gt: $scope.applyFiltersObj.amountFilter.amount__gt
                    };

                    break;
                case 'Is greater than':
                    amountObj = {
                        amount: null,
                        amount__lt: null,
                        amount__gt: $scope.applyFiltersObj.amountFilter.amount__gt
                    };

                    break;
                case 'Is less than':
                    amountObj = {
                        amount: null,
                        amount__lt: $scope.applyFiltersObj.amountFilter.amount__lt,
                        amount__gt: null
                    };

                    break;
                default:
                    break;
            }

            return amountObj;
        };

        vm.getReferenceFilters = function () {
            var referenceObj = {
                reference: null,
                reference__lt: null,
                reference__gt: null
            };

            switch($scope.applyFiltersObj.referenceFilter.selectedReferenceOption) {
                case 'Is equal to':
                    referenceObj = {
                        reference: $scope.applyFiltersObj.referenceFilter.reference,
                        reference__lt: null,
                        reference__gt: null
                    };

                    break;
                case 'Is between':
                    referenceObj = {
                        reference: null,
                        reference__lt: $scope.applyFiltersObj.referenceFilter.reference__lt,
                        reference__gt: $scope.applyFiltersObj.referenceFilter.reference__gt
                    };

                    break;
                case 'Is greater than':
                    referenceObj = {
                        reference: null,
                        reference__lt: null,
                        reference__gt: $scope.applyFiltersObj.referenceFilter.reference__gt
                    };

                    break;
                case 'Is less than':
                    referenceObj = {
                        reference: null,
                        reference__lt: $scope.applyFiltersObj.referenceFilter.reference__lt,
                        reference__gt: null
                    };

                    break;
                default:
                    break;
            }

            return referenceObj;
        };

        vm.getVisibleColumnsArray = function () {
            var visibleColumnsArray = [];

            $scope.headerColumns.forEach(function (col) {
                if(col.visible){
                    if(col.fieldName === 'user' || col.fieldName === 'username' || col.fieldName === 'userId' || col.fieldName === 'mobile'){
                        visibleColumnsArray.push('user');
                    } else if(col.fieldName === 'recipient' || col.fieldName === 'destination_tx_id'){
                        visibleColumnsArray.push('destination_transaction');
                    } else if(col.fieldName === 'currencyCode'){
                        visibleColumnsArray.push('currency');
                    } else if(col.fieldName === 'createdDate'){
                        visibleColumnsArray.push('created');
                    } else if(col.fieldName === 'updatedDate'){
                        visibleColumnsArray.push('updated');
                    } else if(col.fieldName === 'totalAmount'){
                        visibleColumnsArray.push('total_amount');
                        visibleColumnsArray.push('currency');
                    } else if(col.fieldName === 'source_tx_id'){
                        visibleColumnsArray.push('source_transaction');
                    } else {
                        visibleColumnsArray.push(col.fieldName);
                        if(col.fieldName === 'amount' || col.fieldName === 'fee' || col.fieldName === 'balance'){
                            visibleColumnsArray.push('currency');
                        }
                    }
                }
            });

            return _.uniq(visibleColumnsArray);
        };

        vm.getTransactionsFiltersObj = function(){
            $scope.filtersCount = 0;
            $scope.filtersObjForExport = {};

            for(var x in $scope.filtersObj){
                if($scope.filtersObj.hasOwnProperty(x)){
                    if($scope.filtersObj[x]){
                        $scope.filtersCount = $scope.filtersCount + 1;
                    }
                }
            }

            if($scope.filtersObj.dateFilter){
                vm.dateObj = vm.getDateFilters();
            } else{
                vm.dateObj = {
                    created__lt: null,
                    created__gt: null
                };
            }

            if($scope.filtersObj.amountFilter){
                vm.amountObj = vm.getAmountFilters();
            } else{
                vm.amountObj = {
                    amount: null,
                    amount__lt: null,
                    amount__gt: null
                };
            }

            if($scope.filtersObj.referenceFilter){
                vm.referenceObj = vm.getReferenceFilters();
            } else{
                vm.referenceObj = {
                    reference: null,
                    reference__lt: null,
                    reference__gt: null
                };
            }

            $scope.visibleColumnsArray = vm.getVisibleColumnsArray();

            var searchObj = {
                page: $scope.pagination.pageNo,
                page_size: $scope.filtersObj.pageSizeFilter? $scope.pagination.itemsPerPage : 25,
                amount: vm.amountObj.amount ? currencyModifiers.convertToCents(vm.amountObj.amount,$scope.applyFiltersObj.currencyFilter.selectedCurrencyOption.divisibility) : null,
                amount__lt: vm.amountObj.amount__lt ? currencyModifiers.convertToCents(vm.amountObj.amount__lt,$scope.applyFiltersObj.currencyFilter.selectedCurrencyOption.divisibility) : null,
                amount__gt: vm.amountObj.amount__gt ? currencyModifiers.convertToCents(vm.amountObj.amount__gt,$scope.applyFiltersObj.currencyFilter.selectedCurrencyOption.divisibility) : null,
                reference: vm.referenceObj.reference ? vm.referenceObj.reference : null,
                reference__lt: vm.referenceObj.reference__lt ? vm.referenceObj.reference__lt : null,
                reference__gt: vm.referenceObj.reference__gt ? vm.referenceObj.reference__gt : null,
                created__gt: vm.dateObj.created__gt ? Date.parse(vm.dateObj.created__gt +'T00:00:00') : null,
                created__lt: vm.dateObj.created__lt ? Date.parse(vm.dateObj.created__lt +'T00:00:00') : null,
                currency: $scope.filtersObj.currencyFilter || $scope.filtersObj.amountFilter ? $scope.applyFiltersObj.currencyFilter.selectedCurrencyOption.code: null,
                user: $scope.filtersObj.userFilter ? ($scope.applyFiltersObj.userFilter.selectedUserOption ? $scope.applyFiltersObj.userFilter.selectedUserOption : null): null,
                account__name: $scope.filtersObj.accountFilter ? $scope.applyFiltersObj.accountFilter.selectedAccountOption == 'Name' ? $scope.applyFiltersObj.accountFilter.selectedAccountName : null : null,
                account: $scope.filtersObj.accountFilter ? $scope.applyFiltersObj.accountFilter.selectedAccountOption == 'Reference' ? $scope.applyFiltersObj.accountFilter.selectedAccountReference : null : null,
                group: $scope.filtersObj.groupFilter ? $scope.applyFiltersObj.groupFilter.selectedGroupOption == 'Group name'? $scope.applyFiltersObj.groupFilter.selectedGroup.name: null : null,
                group__isnull: $scope.filtersObj.groupFilter ? $scope.applyFiltersObj.groupFilter.selectedGroupOption == 'In a group'? (!$scope.applyFiltersObj.groupFilter.existsInGroup).toString(): null : null,
                orderby: $scope.filtersObj.orderByFilter ? ($scope.applyFiltersObj.orderByFilter.selectedOrderByOption == 'Latest' ? '-created' : $scope.applyFiltersObj.orderByFilter.selectedOrderByOption == 'Largest' ? '-amount' : $scope.applyFiltersObj.orderByFilter.selectedOrderByOption == 'Smallest' ? 'amount' : null): null,
                id: $scope.filtersObj.transactionIdFilter ? ($scope.applyFiltersObj.transactionIdFilter.selectedTransactionIdOption ? $scope.applyFiltersObj.transactionIdFilter.selectedTransactionIdOption : null): null,
                destination_transaction : $scope.filtersObj.destinationIdFilter ? 'true' : null,
                source_transaction : $scope.filtersObj.sourceIdFilter ? 'true' : null,
                tx_type: $scope.filtersObj.transactionTypeFilter ? $scope.applyFiltersObj.transactionTypeFilter.selectedTransactionTypeOption.toLowerCase() : null,
                status: $scope.filtersObj.statusFilter ? $scope.applyFiltersObj.statusFilter.selectedStatusOption: null,
                subtype: $scope.filtersObj.transactionSubtypeFilter ? ($scope.applyFiltersObj.transactionSubtypeFilter.selectedTransactionSubtypeOption ? $scope.applyFiltersObj.transactionSubtypeFilter.selectedTransactionSubtypeOption: null): null,
                fields: $scope.visibleColumnsArray.join(',')
            };

            $scope.filtersObjForExport = searchObj;

            return serializeFiltersService.objectFilters(searchObj);
        };

        $scope.getLatestTransactions = function(applyFilter){
            if(vm.token) {

                $scope.showingFilters = false;
                $scope.showingColumnFilters = false;
                $scope.visibleColumnsSelectionChanged = false;

                $scope.transactionsStateMessage = '';
                $scope.loadingTransactions = true;

                if (applyFilter) {
                    // if function is called from history-filters directive, then pageNo set to 1
                    $scope.pagination.pageNo = 1;
                }

                if ($scope.transactions.length > 0) {
                    $scope.transactions.length = 0;
                }

                var transactionsFiltersObj = vm.getTransactionsFiltersObj();

                Rehive.admin.transactions.get({filters: transactionsFiltersObj}).then(function (res) {
                    $scope.transactionsData = res;
                    vm.formatTransactionsArray($scope.transactionsData.results);
                    if ($scope.transactions.length == 0) {
                        $scope.transactionsStateMessage = 'No transactions have been found';
                        $scope.$apply();
                        return;
                    }

                    $scope.transactionsStateMessage = '';
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingTransactions = false;
                    $scope.transactionsStateMessage = 'Failed to load data';
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        if($state.params.accountRef){
            $scope.filtersObj.accountFilter = true;
            $scope.applyFiltersObj.accountFilter.selectedAccountOption = 'Reference';
            $scope.applyFiltersObj.accountFilter.selectedAccountReference = $state.params.accountRef;
            $scope.getLatestTransactions();
        } else if($state.params.id) {
            $scope.filtersObj.userFilter = true;
            $scope.applyFiltersObj.userFilter.selectedUserOption = $state.params.id;
            $scope.getLatestTransactions();
        } else if($state.params.transactionId) {
            $scope.filtersObj.transactionIdFilter = true;
            $scope.applyFiltersObj.transactionIdFilter.selectedTransactionIdOption = $state.params.transactionId;
            $scope.getLatestTransactions();
        } else if($state.params.currencyCode) {
            $scope.filtersObj.currencyFilter = true;
            $scope.applyFiltersObj.currencyFilter.selectedCurrencyOption.code = $state.params.currencyCode;
            $scope.getLatestTransactions();
        } else {
            $scope.getLatestTransactions();
        }

        vm.formatTransactionsArray = function (transactionsArray) {
            transactionsArray.forEach(function (transactionObj) {
                $scope.transactions.push({
                    user: transactionObj.user ? transactionObj.user.email || transactionObj.user.mobile || transactionObj.user.id : '',
                    recipient: transactionObj.destination_transaction ? transactionObj.destination_transaction.id ? transactionObj.destination_transaction.user.email : transactionObj.destination_transaction.user.email + ' (new user)' : "",
                    tx_type: transactionObj.tx_type ? $filter("capitalizeWord")(transactionObj.tx_type) : '',
                    subtype: transactionObj.subtype ? transactionObj.subtype : '',
                    currencyCode: transactionObj.currency ? transactionObj.currency.code : '',
                    amount: transactionObj.amount ? $filter("currencyModifiersFilter")(transactionObj.amount,transactionObj.currency.divisibility) : '',
                    fee: transactionObj.fee ? $filter("currencyModifiersFilter")(transactionObj.fee,transactionObj.currency.divisibility) : '',
                    status: transactionObj.status ? transactionObj.status : '',
                    id: transactionObj.id ? transactionObj.id : '',
                    createdDate: transactionObj.created ? $filter("date")(transactionObj.created,'mediumDate') + ' ' + $filter("date")(transactionObj.created,'shortTime') : '',
                    totalAmount: transactionObj.total_amount ? $filter("currencyModifiersFilter")(transactionObj.total_amount,transactionObj.currency.divisibility) : '',
                    balance: transactionObj.balance ? $filter("currencyModifiersFilter")(transactionObj.balance,transactionObj.currency.divisibility) : '',
                    account: transactionObj.account ? transactionObj.account : '',
                    username: transactionObj.user ? transactionObj.user.username : '',
                    userId: transactionObj.user ? transactionObj.user.id : '',
                    updatedDate: transactionObj.updated ? $filter("date")(transactionObj.updated,'mediumDate') + ' ' + $filter("date")(transactionObj.updated,'shortTime') : '',
                    mobile: transactionObj.user ? transactionObj.user.mobile : '',
                    destination_tx_id: transactionObj.destination_transaction ? transactionObj.destination_transaction.id ? transactionObj.destination_transaction.id : 'ID pending creation' : "",
                    source_tx_id: transactionObj.source_transaction ? transactionObj.source_transaction.id : "",
                    label: transactionObj.label ? transactionObj.label : '',
                    reference: transactionObj.reference ? transactionObj.reference : '',
                    note: transactionObj.note ? transactionObj.note : '',
                    metadata: transactionObj.metadata
                });
            });

            $scope.loadingTransactions = false;
        };

        $scope.getUsersEmailTypeahead = typeaheadService.getUsersEmailTypeahead();

        $scope.openModal = function (page, size,transaction) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'historyModalCtrl',
                resolve: {
                    transaction: function () {
                        return transaction;
                    }
                }
            });

        };

        $scope.openExportTransactionsModal = function (page, size) {
            vm.theExportModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'ExportConfirmModalCtrl',
                resolve: {
                    filtersObjForExport: function () {
                        return $scope.filtersObjForExport;
                    },
                    visibleColumnsArray: function () {
                        return $scope.visibleColumnsArray;
                    }
                }
            });

            vm.theExportModal.result.then(function(transaction){
                if(transaction){
                    //$scope.getLatestTransactions();
                }
            }, function(){
            });

        };

        $scope.openMakeTransactionModal = function (page, size,newTransactionParams) {
            vm.theCreateModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'MakeTransactionModalCtrl',
                resolve: {
                    newTransactionParams: function () {
                        return newTransactionParams;
                    }
                }
            });

            vm.theCreateModal.result.then(function(transaction){
                if(transaction.id){
                    $scope.openModal('app/pages/transactions/history/historyModal/historyModal.html','md',transaction);
                } else if(transaction){
                    $scope.getLatestTransactions();
                }
            }, function(){
            });

        };

        $scope.$on("modalClosing",function(event,transactionHasBeenUpdated){
           if(transactionHasBeenUpdated){
               $scope.clearFilters();
               $scope.getLatestTransactions();
           }
        });

        $scope.closeColumnFiltersBox = function () {
            if($scope.visibleColumnsSelectionChanged){
                $scope.getLatestTransactions();
            }
            $scope.showingColumnFilters = false;
        };

        // shortcuts from other places

        if(vm.newTransactionParams.userEmail){
            $scope.openMakeTransactionModal('app/pages/transactions/history/makeTransactionModal/makeTransactionModal.html', 'md',vm.newTransactionParams);
        }

        if(vm.newTransactionParams.txType){
            $scope.openMakeTransactionModal('app/pages/transactions/history/makeTransactionModal/makeTransactionModal.html', 'md',vm.newTransactionParams);
        }

    }
})();