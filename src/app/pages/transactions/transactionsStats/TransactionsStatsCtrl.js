(function () {
    'use strict';

    angular.module('BlurAdmin.pages.transactions.stats')
        .controller('TransactionsStatsCtrl', TransactionsStatsCtrl);

    /** @ngInject */
    function TransactionsStatsCtrl($scope,Rehive,serializeFiltersService,localStorageManagement,toastr,errorHandler) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        $scope.loadingStats = false;
        $scope.currencyObj = {};
        $scope.currencyOptions = [];
        $scope.transactionTotalObj = {};
        $scope.dateFilterOptions = ['Is in the last','In between','Is equal to','Is after','Is before'];
        $scope.dateFilterIntervalOptions = ['days','months'];
        $scope.filtersObj = {
            accountFilter: false,
            currencyFilter: false,
            dateFilter: false
        };
        $scope.applyFiltersObj = {
            accountFilter: {
                selectedAccount: null
            },
            currencyFilter:{
                selectedCurrencyOption: {}
            },
            dateFilter: {
                selectedDateOption: 'Is in the last',
                selectedDayIntervalOption: 'days',
                dayInterval: '',
                dateFrom: '',
                dateTo: '',
                dateEqualTo: ''
            }
        };

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

        //end angular datepicker

        $scope.clearFilters = function () {
            $scope.filtersObj = {
                accountFilter: false,
                currencyFilter: false,
                dateFilter: false
            };
        };

        $scope.showFilters = function () {
            $scope.showingFilters = !$scope.showingFilters;
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

        vm.getTransactionsStatsFiltersObj = function(){
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

            var searchObj = {
                created__gt: vm.dateObj.created__gt ? Date.parse(vm.dateObj.created__gt +'T00:00:00') : null,
                created__lt: vm.dateObj.created__lt ? Date.parse(vm.dateObj.created__lt +'T00:00:00') : null,
                currency: $scope.filtersObj.currencyFilter || $scope.filtersObj.amountFilter ? $scope.applyFiltersObj.currencyFilter.selectedCurrencyOption.code: null,
                account: $scope.filtersObj.accountFilter ? $scope.applyFiltersObj.accountFilter.selectedAccount: null
            };

            $scope.filtersObjForExport = searchObj;

            return serializeFiltersService.objectFilters(searchObj);
        };

        $scope.getTransactionTotals = function () {
            $scope.loadingStats = true;
            $scope.showingFilters = false;

            var transactionsStatsFiltersObj = vm.getTransactionsStatsFiltersObj();

            Rehive.admin.transactions.totals.get({filters: transactionsStatsFiltersObj}).then(function (res) {
                $scope.transactionTotalObj = res;
                vm.getAllCompanyCurrencies($scope.transactionTotalObj);
                $scope.$apply();
            }, function (error) {
                $scope.loadingStats = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };
        $scope.getTransactionTotals();

        vm.getAllCompanyCurrencies = function (transactionTotalObj) {
            $scope.loadingStats = true;
            Rehive.admin.currencies.get({filters: {
                page_size: 250,
                enabled: true
            }}).then(function (res) {
                if(res.results.length > 0){
                    $scope.currencyOptions = res.results;
                    $scope.currencyOptions.forEach(function (currency) {
                       if(currency.code == transactionTotalObj.currency){
                           $scope.applyFiltersObj.currencyFilter.selectedCurrencyOption = currency;
                           $scope.currencyObj = currency;
                           $scope.loadingStats = false;
                           $scope.$apply();
                       }
                    });
                } else {
                    // test new company no currencies scenario
                    $scope.loadingStats = false;
                    $scope.$apply();
                }
            }, function (error) {
                $scope.loadingStats = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

    }
})();
