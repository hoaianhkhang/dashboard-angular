(function () {
    'use strict';

    angular.module('BlurAdmin.pages.transactions.history')
        .controller('HistoryCtrl', HistoryCtrl);

    /** @ngInject */
    function HistoryCtrl($scope,environmentConfig,$http,cookieManagement,$uibModal,sharedResources,toastr,
                         errorHandler,$state,$window,typeaheadService,$filter,serializeFiltersService) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
        vm.currenciesList = JSON.parse($window.sessionStorage.currenciesList || '[]');
        $scope.showingFilters = false;
        $scope.dateFilterOptions = ['Is in the last','In between','Is equal to','Is after','Is before'];
        $scope.amountFilterOptions = ['Is equal to','Is between','Is greater than','Is less than']
        $scope.dateFilterIntervalOptions = ['days','months'];
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
                selectedAmountOption: 'Is equal to'
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
            userFilter: {
                selectedUserOption: $state.params.code || null
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

        sharedResources.getSubtypes().then(function (res) {
            $scope.subtypeOptions = _.pluck(res.data.data,'name');
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
            vm.currenciesList.forEach(function (element) {
                if(element.code == $state.params.currencyCode){
                    $scope.applyFiltersObj.currencyFilter.selectedCurrencyOption = element;
                }
            });
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

        vm.getTransactionUrl = function(){

            if($scope.filtersObj.dateFilter){
                vm.dateObj = vm.getDateFilters();
            } else{
                vm.dateObj = {
                    created__lt: null,
                    created__gt: null
                };
            }

            var searchObj = {
                page: $scope.pagination.pageNo,
                page_size: $scope.pagination.itemsPerPage || 1,
                created__gt: vm.dateObj.created__gt ? Date.parse(vm.dateObj.created__gt) : null,
                created__lt: vm.dateObj.created__lt ? Date.parse(vm.dateObj.created__lt) : null,
                currency: $scope.filtersObj.currencyFilter ? $scope.applyFiltersObj.currencyFilter.selectedCurrencyOption.code: null,
                user: $scope.filtersObj.userFilter ? ($scope.applyFiltersObj.userFilter.selectedUserOption ? encodeURIComponent($scope.applyFiltersObj.userFilter.selectedUserOption) : null): null,
                orderby: $scope.filtersObj.orderByFilter ? ($scope.applyFiltersObj.orderByFilter.selectedOrderByOption == 'Latest' ? '-created' : $scope.applyFiltersObj.orderByFilter.selectedOrderByOption == 'Largest' ? '-amount' : $scope.applyFiltersObj.orderByFilter.selectedOrderByOption == 'Smallest' ? 'amount' : null): null,
                id: $scope.filtersObj.transactionIdFilter ? ($scope.applyFiltersObj.transactionIdFilter.selectedTransactionIdOption ? encodeURIComponent($scope.applyFiltersObj.transactionIdFilter.selectedTransactionIdOption) : null): null,
                tx_type: $scope.filtersObj.transactionTypeFilter ? $scope.applyFiltersObj.transactionTypeFilter.selectedTransactionTypeOption.toLowerCase() : null,
                status: $scope.filtersObj.statusFilter ? $scope.applyFiltersObj.statusFilter.selectedStatusOption: null,
                subtype: $scope.filtersObj.transactionTypeFilter ? ($scope.applyFiltersObj.transactionSubtypeFilter.selectedTransactionSubtypeOption ? $scope.applyFiltersObj.transactionSubtypeFilter.selectedTransactionSubtypeOption: null): null
            };

            return environmentConfig.API + '/admin/transactions/?' + serializeFiltersService.serializeFilters(searchObj);
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

                var transactionsUrl = vm.getTransactionUrl();

                $http.get(transactionsUrl, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingTransactions = false;
                    if (res.status === 200) {
                        $scope.transactionsData = res.data.data;
                        $scope.transactions = $scope.transactionsData.results;
                        if ($scope.transactions == 0) {
                            $scope.transactionsStateMessage = 'No transactions have been made';
                            return;
                        }

                        $scope.transactionsStateMessage = '';
                    }
                }).catch(function (error) {
                    $scope.loadingTransactions = false;
                    $scope.transactionsStateMessage = 'Failed to load data';
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        $scope.getLatestTransactions();

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

            vm.theModal.result.then(function(transaction){
                if(transaction){
                    $scope.clearFilters()
                    $scope.getLatestTransactions();
                }
            }, function(){
            });
        };


    }
})();
