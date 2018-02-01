(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.bitcoinService.bitcoinServiceAccounts')
        .controller('BitcoinColdstorageCtrl', BitcoinColdstorageCtrl);

    /** @ngInject */
    function BitcoinColdstorageCtrl($scope,cookieManagement,errorHandler,currenciesList,$http,$uibModal,
                                    sharedResources,_,environmentConfig,currencyModifiers,toastr,serializeFiltersService) {

        var vm = this;
        vm.serviceUrl = cookieManagement.getCookie('SERVICEURL');
        vm.token = cookieManagement.getCookie('TOKEN');
        $scope.bitcoinCurrency = currenciesList.find(function (element) {
            return element.code == 'XBT';
        });
        $scope.showOptionsAccountRef = false;
        $scope.loadingColdstorage = true;

        $scope.closeOptionsBox = function () {
            $scope.showOptionsAccountRef = false;
        };

        $scope.toggleCurrenciesOptions = function () {
            $scope.showOptionsAccountRef = !$scope.showOptionsAccountRef;
        };

        vm.getColdstorage = function () {
            $scope.loadingColdstorage =  true;
            if(vm.token) {
                $http.get(vm.serviceUrl + 'admin/coldstorage/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $scope.coldstorageObj = res.data.data;
                        $scope.getLatestColdstorageTransactions();
                    }
                }).catch(function (error) {
                    $scope.loadingColdstorage =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        vm.getColdstorage();

        //transactions logic

        $scope.showingColdstorageFilters = false;
        $scope.dateFilterColdstorageOptions = ['Is in the last','In between','Is equal to','Is after','Is before'];
        $scope.amountFilterColdstorageOptions = ['Is equal to','Is between','Is greater than','Is less than'];
        $scope.dateFilterIntervalColdstorageOptions = ['days','months'];
        $scope.filtersColdstorageCount = 0;
        $scope.filtersColdstorageObj = {
            dateFilter: false,
            amountFilter: false,
            statusFilter: false,
            transactionTypeFilter: false,
            transactionIdFilter: false,
            pageSizeFilter: false,
            orderByFilter: false
        };
        $scope.applyFiltersColdstorageObj = {
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
            orderByFilter: {
                selectedOrderByOption: 'Latest'
            }
        };
        $scope.coldstoragePagination = {
            itemsPerPage: 26,
            pageNo: 1,
            maxSize: 5
        };
        $scope.transactionsColdstorage = [];
        $scope.transactionsColdstorageStateMessage = '';
        $scope.transactionsColdstorageData = {};
        $scope.typeOptions = ['Credit','Debit']; //Transfer
        $scope.statusOptions = ['Pending','Complete','Failed','Deleted'];
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
        //for angular datepicker end

        $scope.orderByFunction = function () {
            return ($scope.applyFiltersColdstorageObj.orderByFilter.selectedOrderByOption == 'Latest' ? '-created' :
                $scope.applyFiltersColdstorageObj.orderByFilter.selectedOrderByOption == 'Largest' ? '-amount' :
                    $scope.applyFiltersColdstorageObj.orderByFilter.selectedOrderByOption == 'Smallest' ? 'amount' : '');
        };

        $scope.pageSizeChanged =  function () {
            if($scope.coldstoragePagination.itemsPerPage > 250){
                $scope.coldstoragePagination.itemsPerPage = 250;
            }
        };

        $scope.showColdstorageFilters = function () {
            $scope.showingColdstorageFilters = !$scope.showingColdstorageFilters;
        };

        $scope.clearFilters = function () {
            $scope.filtersColdstorageObj = {
                dateFilter: false,
                amountFilter: false,
                statusFilter: false,
                transactionTypeFilter: false,
                transactionIdFilter: false,
                userFilter: false,
                pageSizeFilter: false,
                orderByFilter: false
            };
        };

        $scope.dayIntervalChanged = function () {
            if($scope.applyFiltersColdstorageObj.dateFilter.dayInterval <= 0){
                toastr.success('Please enter a positive value');
            }
        };

        vm.getDateFilters = function () {
            var dateObj = {
                created__lt: null,
                created__gt: null
            };

            switch($scope.applyFiltersColdstorageObj.dateFilter.selectedDateOption) {
                case 'Is in the last':
                    if($scope.applyFiltersColdstorageObj.dateFilter.selectedDayIntervalOption == 'days'){
                        dateObj.created__lt = moment().add(1,'days').format('YYYY-MM-DD');
                        dateObj.created__gt = moment().subtract($scope.applyFiltersColdstorageObj.dateFilter.dayInterval,'days').format('YYYY-MM-DD');
                    } else {
                        dateObj.created__lt = moment().add(1,'days').format('YYYY-MM-DD');
                        dateObj.created__gt = moment().subtract($scope.applyFiltersColdstorageObj.dateFilter.dayInterval,'months').format('YYYY-MM-DD');
                    }

                    break;
                case 'In between':
                    dateObj.created__lt = moment(new Date($scope.applyFiltersColdstorageObj.dateFilter.dateTo)).add(1,'days').format('YYYY-MM-DD');
                    dateObj.created__gt = moment(new Date($scope.applyFiltersColdstorageObj.dateFilter.dateFrom)).format('YYYY-MM-DD');

                    break;
                case 'Is equal to':
                    dateObj.created__lt = moment(new Date($scope.applyFiltersColdstorageObj.dateFilter.dateEqualTo)).add(1,'days').format('YYYY-MM-DD');
                    dateObj.created__gt = moment(new Date($scope.applyFiltersColdstorageObj.dateFilter.dateEqualTo)).format('YYYY-MM-DD');

                    break;
                case 'Is after':
                    dateObj.created__lt = null;
                    dateObj.created__gt = moment(new Date($scope.applyFiltersColdstorageObj.dateFilter.dateFrom)).add(1,'days').format('YYYY-MM-DD');
                    break;
                case 'Is before':
                    dateObj.created__lt = moment(new Date($scope.applyFiltersColdstorageObj.dateFilter.dateTo)).format('YYYY-MM-DD');
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

            switch($scope.applyFiltersColdstorageObj.amountFilter.selectedAmountOption) {
                case 'Is equal to':
                    amountObj = {
                        amount: $scope.applyFiltersColdstorageObj.amountFilter.amount,
                        amount__lt: null,
                        amount__gt: null
                    };

                    break;
                case 'Is between':
                    amountObj = {
                        amount: null,
                        amount__lt: $scope.applyFiltersColdstorageObj.amountFilter.amount__lt,
                        amount__gt: $scope.applyFiltersColdstorageObj.amountFilter.amount__gt
                    };

                    break;
                case 'Is greater than':
                    amountObj = {
                        amount: null,
                        amount__lt: null,
                        amount__gt: $scope.applyFiltersColdstorageObj.amountFilter.amount__gt
                    };

                    break;
                case 'Is less than':
                    amountObj = {
                        amount: null,
                        amount__lt: $scope.applyFiltersColdstorageObj.amountFilter.amount__lt,
                        amount__gt: null
                    };

                    break;
                default:
                    break;
            }

            return amountObj;
        };

        vm.getTransactionUrl = function(){
            $scope.filtersColdstorageCount = 0;

            for(var x in $scope.filtersColdstorageObj){
                if($scope.filtersColdstorageObj.hasOwnProperty(x)){
                    if($scope.filtersColdstorageObj[x]){
                        $scope.filtersColdstorageCount = $scope.filtersColdstorageCount + 1;
                    }
                }
            }

            if($scope.filtersColdstorageObj.dateFilter){
                vm.dateObj = vm.getDateFilters();
            } else{
                vm.dateObj = {
                    created__lt: null,
                    created__gt: null
                };
            }

            if($scope.filtersColdstorageObj.amountFilter){
                vm.amountObj = vm.getAmountFilters();
            } else{
                vm.amountObj = {
                    amount: null,
                    amount__lt: null,
                    amount__gt: null
                };
            }

            var searchObj = {
                page: $scope.coldstoragePagination.pageNo,
                page_size: $scope.filtersColdstorageObj.pageSizeFilter? $scope.coldstoragePagination.itemsPerPage : 26,
                amount: vm.amountObj.amount ? currencyModifiers.convertToCents(vm.amountObj.amount,8) : null,
                amount__lt: vm.amountObj.amount__lt ? currencyModifiers.convertToCents(vm.amountObj.amount__lt,8) : null,
                amount__gt: vm.amountObj.amount__gt ? currencyModifiers.convertToCents(vm.amountObj.amount__gt,8) : null,
                created__gt: vm.dateObj.created__gt ? Date.parse(vm.dateObj.created__gt +'T00:00:00') : null,
                created__lt: vm.dateObj.created__lt ? Date.parse(vm.dateObj.created__lt +'T00:00:00') : null,
                account: $scope.coldstorageObj.rehive_account_reference,
                orderby: $scope.filtersColdstorageObj.orderByFilter ? ($scope.applyFiltersColdstorageObj.orderByFilter.selectedOrderByOption == 'Latest' ? '-created' : $scope.applyFiltersColdstorageObj.orderByFilter.selectedOrderByOption == 'Largest' ? '-amount' : $scope.applyFiltersColdstorageObj.orderByFilter.selectedOrderByOption == 'Smallest' ? 'amount' : null): null,
                id: $scope.filtersColdstorageObj.transactionIdFilter ? ($scope.applyFiltersColdstorageObj.transactionIdFilter.selectedTransactionIdOption ? encodeURIComponent($scope.applyFiltersColdstorageObj.transactionIdFilter.selectedTransactionIdOption) : null): null,
                tx_type: $scope.filtersColdstorageObj.transactionTypeFilter ? $scope.applyFiltersColdstorageObj.transactionTypeFilter.selectedTransactionTypeOption.toLowerCase() : null,
                status: $scope.filtersColdstorageObj.statusFilter ? $scope.applyFiltersColdstorageObj.statusFilter.selectedStatusOption: null,
                subtype: $scope.filtersColdstorageObj.transactionTypeFilter ? ($scope.applyFiltersColdstorageObj.transactionSubtypeFilter.selectedTransactionSubtypeOption ? $scope.applyFiltersColdstorageObj.transactionSubtypeFilter.selectedTransactionSubtypeOption: null): null
            };

            return environmentConfig.API + '/admin/transactions/?' + serializeFiltersService.serializeFilters(searchObj);
        };

        $scope.getLatestColdstorageTransactions = function(applyFilter){
            if(vm.token) {

                $scope.showingColdstorageFilters = false;

                $scope.transactionsColdstorageStateMessage = '';
                $scope.loadingColdstorageTransactions =  true;

                if (applyFilter) {
                    // if function is called from history-filters directive, then pageNo set to 1
                    $scope.coldstoragePagination.pageNo = 1;
                }

                if ($scope.transactionsColdstorage.length > 0) {
                    $scope.transactionsColdstorage.length = 0;
                }

                var transactionsUrl = vm.getTransactionUrl();

                $http.get(transactionsUrl, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingColdstorage =  false;
                    $scope.loadingColdstorageTransactions =  false;
                    if (res.status === 200) {
                        $scope.transactionsColdstorageData = res.data.data;
                        $scope.transactionsColdstorage = $scope.transactionsColdstorageData.results;
                        if ($scope.transactionsColdstorage.length == 0) {
                            $scope.transactionsColdstorageStateMessage = 'No transactions have been found';
                            return;
                        }

                        $scope.transactionsColdstorageStateMessage = '';
                    }
                }).catch(function (error) {
                    $scope.loadingColdstorage =  false;
                    $scope.loadingColdstorageTransactions =  false;
                    $scope.transactionsColdstorageStateMessage = 'Failed to load data';
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.openModal = function (page, size,transaction) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'ColdstorageTransactionModalCtrl',
                resolve: {
                    transaction: function () {
                        return transaction;
                    }
                }
            });

            vm.theModal.result.then(function(transaction){
                if(transaction){
                    $scope.clearFilters();
                    $scope.getLatestColdstorageTransactions();
                }
            }, function(){
            });
        };


    }
})();
