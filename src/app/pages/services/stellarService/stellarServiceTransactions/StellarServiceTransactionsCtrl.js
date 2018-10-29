(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarService.stellarServiceTransactions')
        .controller('StellarServiceTransactionsCtrl', StellarServiceTransactionsCtrl);

    /** @ngInject */
    function StellarServiceTransactionsCtrl($scope,$http,localStorageManagement,$uibModal,toastr,
                                            errorHandler,$state,$window,typeaheadService,serializeFiltersService) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.serviceUrl = localStorageManagement.getValue('SERVICEURL');
        $scope.companyDateFormatString = localStorageManagement.getValue('DATE_FORMAT');
        vm.currenciesList = JSON.parse($window.sessionStorage.currenciesList || '[]');
        $scope.showingFilters = false;
        $scope.dateFilterOptions = ['Is in the last','In between','Is equal to','Is after','Is before'];
        $scope.amountFilterOptions = ['Is equal to','Is between','Is greater than','Is less than'];
        $scope.dateFilterIntervalOptions = ['days','months'];
        $scope.filtersCount = 0;
        $scope.filtersObj = {
            dateFilter: false,
            statusFilter: false,
            transactionTypeFilter: false,
            transactionHashFilter: false,
            transactionIdFilter: false,
            userFilter: false,
            pageSizeFilter: false
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
            updatedFilter: {
                selectedDateOption: 'Is in the last',
                selectedDayIntervalOption: 'days',
                dayInterval: '',
                dateFrom: '',
                dateTo: '',
                dateEqualTo: ''
            },
            completedFilter: {
                selectedDateOption: 'Is in the last',
                selectedDayIntervalOption: 'days',
                dayInterval: '',
                dateFrom: '',
                dateTo: '',
                dateEqualTo: ''
            },
            statusFilter: {
                selectedStatusOption: 'Pending'
            },
            transactionTypeFilter: {
                selectedTransactionTypeOption: 'Deposit'
            },
            transactionHashFilter: {
                selectedTransactionHashOption: null
            },
            transactionIdFilter: {
                selectedTransactionIdOption: null
            },
            userFilter: {
                selectedUserOption: $state.params.id || null
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
        $scope.typeOptions = ['Deposit','Send','Withdraw'];
        $scope.statusOptions = ['Pending','Confirmed','Complete','Failed'];

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

        $scope.popup3 = {};
        $scope.open3 = function() {
            $scope.popup3.opened = true;
        };

        $scope.popup4 = {};
        $scope.open4 = function() {
            $scope.popup4.opened = true;
        };

        $scope.popup5 = {};
        $scope.open5 = function() {
            $scope.popup5.opened = true;
        };

        $scope.popup6 = {};
        $scope.open6 = function() {
            $scope.popup6.opened = true;
        };

        // end angular datepicker

        $scope.pageSizeChanged =  function () {
            if($scope.pagination.itemsPerPage > 250){
                $scope.pagination.itemsPerPage = 250;
            }
        };

        $scope.showFilters = function () {
            $scope.showingFilters = !$scope.showingFilters;
        };

        $scope.clearFilters = function () {
            $scope.filtersObj = {
                dateFilter: false,
                statusFilter: false,
                transactionTypeFilter: false,
                transactionHashFilter: false,
                transactionIdFilter: false,
                userFilter: false,
                pageSizeFilter: false
            };
        };

        $scope.dayIntervalChanged = function (dayInterval) {
            if(dayInterval <= 0){
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

        vm.getUpdatedFilters = function () {
            var updatedDateObj = {
                updated__lt: null,
                created__gt: null
            };

            switch($scope.applyFiltersObj.updatedFilter.selectedDateOption) {
                case 'Is in the last':
                    if($scope.applyFiltersObj.updatedFilter.selectedDayIntervalOption == 'days'){
                        updatedDateObj.updated__lt = moment().add(1,'days').format('YYYY-MM-DD');
                        updatedDateObj.updated__gt = moment().subtract($scope.applyFiltersObj.updatedFilter.dayInterval,'days').format('YYYY-MM-DD');
                    } else {
                        updatedDateObj.updated__lt = moment().add(1,'days').format('YYYY-MM-DD');
                        updatedDateObj.updated__gt = moment().subtract($scope.applyFiltersObj.updatedFilter.dayInterval,'months').format('YYYY-MM-DD');
                    }

                    break;
                case 'In between':
                    updatedDateObj.updated__lt = moment(new Date($scope.applyFiltersObj.updatedFilter.dateTo)).add(1,'days').format('YYYY-MM-DD');
                    updatedDateObj.updated__gt = moment(new Date($scope.applyFiltersObj.updatedFilter.dateFrom)).format('YYYY-MM-DD');

                    break;
                case 'Is equal to':
                    updatedDateObj.updated__lt = moment(new Date($scope.applyFiltersObj.updatedFilter.dateEqualTo)).add(1,'days').format('YYYY-MM-DD');
                    updatedDateObj.updated__gt = moment(new Date($scope.applyFiltersObj.updatedFilter.dateEqualTo)).format('YYYY-MM-DD');

                    break;
                case 'Is after':
                    updatedDateObj.updated__lt = null;
                    updatedDateObj.updated__gt = moment(new Date($scope.applyFiltersObj.updatedFilter.dateFrom)).add(1,'days').format('YYYY-MM-DD');
                    break;
                case 'Is before':
                    updatedDateObj.updated__lt = moment(new Date($scope.applyFiltersObj.updatedFilter.dateTo)).format('YYYY-MM-DD');
                    updatedDateObj.updated__gt = null;
                    break;
                default:
                    break;
            }

            return updatedDateObj;
        };

        vm.getCompletedDateFilters = function () {
            var completedDateObj = {
                completed__lt: null,
                completed__gt: null
            };

            switch($scope.applyFiltersObj.completedFilter.selectedDateOption) {
                case 'Is in the last':
                    if($scope.applyFiltersObj.completedFilter.selectedDayIntervalOption == 'days'){
                        completedDateObj.completed__lt = moment().add(1,'days').format('YYYY-MM-DD');
                        completedDateObj.completed__gt = moment().subtract($scope.applyFiltersObj.completedFilter.dayInterval,'days').format('YYYY-MM-DD');
                    } else {
                        completedDateObj.completed__lt = moment().add(1,'days').format('YYYY-MM-DD');
                        completedDateObj.completed__gt = moment().subtract($scope.applyFiltersObj.completedFilter.dayInterval,'months').format('YYYY-MM-DD');
                    }

                    break;
                case 'In between':
                    completedDateObj.completed__lt = moment(new Date($scope.applyFiltersObj.completedFilter.dateTo)).add(1,'days').format('YYYY-MM-DD');
                    completedDateObj.completed__gt = moment(new Date($scope.applyFiltersObj.completedFilter.dateFrom)).format('YYYY-MM-DD');

                    break;
                case 'Is equal to':
                    completedDateObj.completed__lt = moment(new Date($scope.applyFiltersObj.completedFilter.dateEqualTo)).add(1,'days').format('YYYY-MM-DD');
                    completedDateObj.completed__gt = moment(new Date($scope.applyFiltersObj.completedFilter.dateEqualTo)).format('YYYY-MM-DD');

                    break;
                case 'Is after':
                    completedDateObj.completed__lt = null;
                    completedDateObj.completed__gt = moment(new Date($scope.applyFiltersObj.completedFilter.dateFrom)).add(1,'days').format('YYYY-MM-DD');
                    break;
                case 'Is before':
                    completedDateObj.completed__lt = moment(new Date($scope.applyFiltersObj.completedFilter.dateTo)).format('YYYY-MM-DD');
                    completedDateObj.completed__gt = null;
                    break;
                default:
                    break;
            }

            return completedDateObj;
        };

        vm.getTransactionUrl = function(){
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

            if($scope.filtersObj.updatedFilter){
                vm.updatedDateObj = vm.getUpdatedFilters();
            } else{
                vm.updatedDateObj = {
                    updated__lt: null,
                    updated__gt: null
                };
            }

            if($scope.filtersObj.completedFilter){
                vm.completedDateObj = vm.getCompletedDateFilters();
            } else{
                vm.completedDateObj = {
                    completed__lt: null,
                    completed__gt: null
                };
            }

            var searchObj = {
                page: $scope.pagination.pageNo,
                page_size: $scope.filtersObj.pageSizeFilter? $scope.pagination.itemsPerPage : 26,
                created__gt: vm.dateObj.created__gt ? Date.parse(vm.dateObj.created__gt +'T00:00:00') : null,
                created__lt: vm.dateObj.created__lt ? Date.parse(vm.dateObj.created__lt +'T00:00:00') : null,
                updated__gt: vm.updatedDateObj.updated__gt ? Date.parse(vm.updatedDateObj.updated__gt +'T00:00:00') : null,
                updated__lt: vm.updatedDateObj.updated__lt ? Date.parse(vm.updatedDateObj.updated__lt +'T00:00:00') : null,
                completed__gt: vm.completedDateObj.completed__gt ? Date.parse(vm.completedDateObj.completed__gt +'T00:00:00') : null,
                completed__lt: vm.completedDateObj.completed__lt ? Date.parse(vm.completedDateObj.completed__lt +'T00:00:00') : null,
                email: $scope.filtersObj.userFilter ? ($scope.applyFiltersObj.userFilter.selectedUserOption ? encodeURIComponent($scope.applyFiltersObj.userFilter.selectedUserOption) : null): null,
                transaction_hash: $scope.filtersObj.transactionHashFilter ? ($scope.applyFiltersObj.transactionHashFilter.selectedTransactionHashOption ? encodeURIComponent($scope.applyFiltersObj.transactionHashFilter.selectedTransactionHashOption) : null): null,
                rehive_code: $scope.filtersObj.transactionIdFilter ? ($scope.applyFiltersObj.transactionIdFilter.selectedTransactionIdOption ? encodeURIComponent($scope.applyFiltersObj.transactionIdFilter.selectedTransactionIdOption) : null): null,
                tx_type: $scope.filtersObj.transactionTypeFilter ? $scope.applyFiltersObj.transactionTypeFilter.selectedTransactionTypeOption.toLowerCase() : null,
                status: $scope.filtersObj.statusFilter ? $scope.applyFiltersObj.statusFilter.selectedStatusOption: null,
                orderby: '-created'
            };

            return vm.serviceUrl + 'admin/transactions/?' + serializeFiltersService.serializeFilters(searchObj);
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
                            $scope.transactionsStateMessage = 'No transactions have been found';
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
            $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'StellarServiceTransactionsModalCtrl',
                resolve: {
                    transaction: function () {
                        return transaction;
                    }
                }
            });
        };


    }
})();