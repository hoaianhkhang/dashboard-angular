(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user.transactions')
        .controller('UserTransactionsCtrl', UserTransactionsCtrl);

    /** @ngInject */
    function UserTransactionsCtrl($scope,Rehive,localStorageManagement,$uibModal,sharedResources,toastr,currencyModifiers,_,
                         errorHandler,$state,$location,$window,typeaheadService,$filter,serializeFiltersService,$rootScope,$stateParams) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        $rootScope.shouldBeBlue = 'Users';
        vm.currenciesList = JSON.parse($window.sessionStorage.currenciesList || '[]');
        vm.uuid = $stateParams.uuid;
        vm.userTransactionsFilterParams = $location.search();
        $scope.showingFilters = false;
        $scope.accountFilterOptions = [];
        $scope.dateFilterOptions = ['Is in the last','In between','Is equal to','Is after','Is before'];
        $scope.amountFilterOptions = ['Is equal to','Is between','Is greater than','Is less than'];
        $scope.dateFilterIntervalOptions = ['days','months'];
        $scope.filtersCount = 0;
        $scope.filtersObj = {
            dateFilter: false,
            amountFilter: false,
            statusFilter: false,
            transactionTypeFilter: false,
            transactionIdFilter: false,
            accountFilter:false,
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
                selectedTransactionIdOption: $state.params.transactionId || null
            },
            accountFilter: {
                selectedAccount: null
            },
            currencyFilter:{
                selectedCurrencyOption: {}
            },
            orderByFilter: {
                selectedOrderByOption: 'Latest'
            }
        };
        $scope.pagination = {
            itemsPerPage: 26,
            pageNo: 1,
            maxSize: 5
        };
        $scope.transactions = [];
        $scope.transactionsStateMessage = '';
        $scope.transactionsData = {};
        $scope.loadingTransactions = false;
        $scope.typeOptions = ['Credit','Debit']; //Transfer
        $scope.statusOptions = ['Pending','Complete','Failed','Deleted'];
        $scope.currencyOptions = [];
        $scope.orderByOptions = ['Latest','Largest','Smallest'];

        vm.getUserAccounts = function(){
            if(vm.token) {
                Rehive.admin.accounts.get({filters: {user: vm.uuid}}).then(function (res) {
                    if(res.results.length > 0 ){
                        $scope.accountFilterOptions = res.results;
                        $scope.applyFiltersObj.accountFilter.selectedAccount = res.results[0];
                        $scope.$apply();
                    } else {
                        $scope.accountFilterOptions = [];
                        $scope.$apply();
                    }
                }, function (error) {
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.getUserAccounts();

        sharedResources.getSubtypes().then(function (res) {
            $scope.subtypeOptions = _.pluck(res,'name');
            $scope.subtypeOptions.unshift('');
        });

        //for angular datepicker
        $scope.dateObj = {};
        $scope.dateObj.format = 'MM/dd/yyyy';
        $scope.popup1 = {};
        $scope.open1 = function() {
            $scope.popup1.opened = true;
        };

        $scope.popup2 = {};
        $scope.open2 = function() {
            $scope.popup2.opened = true;
        };

        // for CSV starts

        $scope.getFileName = $filter('date')(Date.now(),'mediumDate') + ' ' + $filter('date')(Date.now(),'shortTime') + '-transactionsHistory.csv';

        $scope.getHeader = function () {return ["Id", "User","Balance","Type","Currency", "Amount",
            "Fee","Subtype","Account","Status","Date","Reference","Note","Metadata"]};

        $scope.getCSVArray = function () {
            var array = [];
            $scope.transactions.forEach(function (element) {
                var metadata = '';
                if(typeof element.metadata === 'object' && element.metadata && Object.keys(element.metadata).length > 0){
                    metadata = JSON.stringify(element.metadata);
                } else if (typeof element.metadata === 'string'){
                    metadata = element.metadata;
                } else {
                    metadata = null;
                }
                array.push({
                    Id: element.id,
                    user: element.user.email,
                    balance: $filter('currencyModifiersFilter')(element.balance,element.currency.divisibility).toString(),
                    type: $filter('capitalizeWord')(element.tx_type),
                    currency: element.currency.code,
                    amount: $filter('currencyModifiersFilter')(element.amount,element.currency.divisibility).toString(),
                    fee: $filter('currencyModifiersFilter')(element.fee,element.currency.divisibility).toString(),
                    subtype: element.subtype,
                    account: element.account,
                    status: element.status,
                    date: $filter('date')(element.created,'mediumDate') + ' ' +$filter('date')(element.created,'shortTime'),
                    reference: element.reference,
                    note: element.note,
                    metadata: metadata
                });
            });

            return array;
        };

        // for CSV ends

        $scope.orderByFunction = function () {
            return ($scope.applyFiltersObj.orderByFilter.selectedOrderByOption == 'Latest' ? '-created' :
                $scope.applyFiltersObj.orderByFilter.selectedOrderByOption == 'Largest' ? '-amount' :
                    $scope.applyFiltersObj.orderByFilter.selectedOrderByOption == 'Smallest' ? 'amount' : '');
        };

        $scope.pageSizeChanged =  function () {
            if($scope.pagination.itemsPerPage > 250){
                $scope.pagination.itemsPerPage = 250;
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

        if($state.params.transactionId){
            $scope.filtersObj.transactionIdFilter = true;
        }

        if($state.params.identifier){
            $scope.filtersObj.userFilter = true;
        }

        $scope.showFilters = function () {
            $scope.showingFilters = !$scope.showingFilters;
        };

        $scope.clearFilters = function () {
            $scope.filtersObj = {
                dateFilter: false,
                amountFilter: false,
                statusFilter: false,
                transactionTypeFilter: false,
                transactionIdFilter: false,
                userFilter: false,
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

        vm.getTransactionsFiltersObj = function(){
            $scope.filtersCount = 0;

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

            var searchObj = {
                page: $scope.pagination.pageNo,
                page_size: $scope.filtersObj.pageSizeFilter? $scope.pagination.itemsPerPage : 26,
                amount: vm.amountObj.amount ? currencyModifiers.convertToCents(vm.amountObj.amount,$scope.applyFiltersObj.currencyFilter.selectedCurrencyOption.divisibility) : null,
                amount__lt: vm.amountObj.amount__lt ? currencyModifiers.convertToCents(vm.amountObj.amount__lt,$scope.applyFiltersObj.currencyFilter.selectedCurrencyOption.divisibility) : null,
                amount__gt: vm.amountObj.amount__gt ? currencyModifiers.convertToCents(vm.amountObj.amount__gt,$scope.applyFiltersObj.currencyFilter.selectedCurrencyOption.divisibility) : null,
                created__gt: vm.dateObj.created__gt ? Date.parse(vm.dateObj.created__gt +'T00:00:00') : null,
                created__lt: vm.dateObj.created__lt ? Date.parse(vm.dateObj.created__lt +'T00:00:00') : null,
                currency: $scope.filtersObj.currencyFilter || $scope.filtersObj.amountFilter ? $scope.applyFiltersObj.currencyFilter.selectedCurrencyOption.code: null,
                user: vm.uuid,
                account: $scope.filtersObj.accountFilter ? $scope.applyFiltersObj.accountFilter.selectedAccount.reference: null,
                orderby: $scope.filtersObj.orderByFilter ? ($scope.applyFiltersObj.orderByFilter.selectedOrderByOption == 'Latest' ? '-created' : $scope.applyFiltersObj.orderByFilter.selectedOrderByOption == 'Largest' ? '-amount' : $scope.applyFiltersObj.orderByFilter.selectedOrderByOption == 'Smallest' ? 'amount' : null): null,
                id: $scope.filtersObj.transactionIdFilter ? ($scope.applyFiltersObj.transactionIdFilter.selectedTransactionIdOption ? encodeURIComponent($scope.applyFiltersObj.transactionIdFilter.selectedTransactionIdOption) : null): null,
                tx_type: $scope.filtersObj.transactionTypeFilter ? $scope.applyFiltersObj.transactionTypeFilter.selectedTransactionTypeOption.toLowerCase() : null,
                status: $scope.filtersObj.statusFilter ? $scope.applyFiltersObj.statusFilter.selectedStatusOption: null,
                subtype: $scope.filtersObj.transactionTypeFilter ? ($scope.applyFiltersObj.transactionSubtypeFilter.selectedTransactionSubtypeOption ? $scope.applyFiltersObj.transactionSubtypeFilter.selectedTransactionSubtypeOption: null): null
            };

            return serializeFiltersService.objectFilters(searchObj);
        };

        $scope.getLatestTransactions = function(applyFilter){
            if(vm.token) {

                $scope.showingFilters = false;

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
                    $scope.loadingTransactions = false;
                    $scope.transactionsData = res;
                    $scope.transactions = $scope.transactionsData.results;
                    if($scope.transactions.length == 0) {
                        $scope.transactionsStateMessage = 'No transactions have been found';
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
        if(Object.keys(vm.userTransactionsFilterParams).length == 0){
            $scope.getLatestTransactions();
        }

        if(vm.userTransactionsFilterParams.filterByAccount){
            $scope.filtersObj.accountFilter = true;
            $scope.applyFiltersObj.accountFilter.selectedAccount = vm.userTransactionsFilterParams.filterByAccount;
            $scope.getLatestTransactions();
            $location.search('filterByAccount',null);
            $location.replace();
        }

        $scope.getUsersEmailTypeahead = typeaheadService.getUsersEmailTypeahead();

        $scope.openModal = function (page, size,transaction) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'UserTransactionsModalCtrl',
                resolve: {
                    transaction: function () {
                        return transaction;
                    }
                }
            });

        };

        $scope.$on("modalClosing",function(event,transactionHasBeenUpdated){
            if(transactionHasBeenUpdated){
                $scope.clearFilters();
                $scope.getLatestTransactions();
            }
        });

        $scope.goToNewTransactionModal = function () {
            $location.path('/transactions/history').search({userEmail: ($scope.user.email).toString()});
        };

    }
})();


