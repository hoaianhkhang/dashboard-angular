(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarTestnetService.stellarTestnetServiceAccounts')
        .controller('StellarTestnetWarmstorageCtrl', StellarTestnetWarmstorageCtrl);

    /** @ngInject */
    function StellarTestnetWarmstorageCtrl($scope,localStorageManagement,errorHandler,$http,$uibModal,multiOptionsFilterService,cleanObject,
                                           sharedResources,_,environmentConfig,currencyModifiers,toastr,serializeFiltersService) {

        var vm = this;
        // vm.serviceUrl = localStorageManagement.getValue('SERVICEURL');
        vm.serviceUrl = "https://stellar-testnet.services.rehive.io/api/1/";
        vm.token = localStorageManagement.getValue('TOKEN');
        $scope.companyDateFormatString = localStorageManagement.getValue('DATE_FORMAT');
        $scope.stellarCurrency = {
            code: "TXLM",
            description: "Stellar Lumen",
            symbol: "*",
            unit: "lumen",
            divisibility: 7
        };
        $scope.showOptionsAccountRef = false;
        $scope.loadingWarmstorage = true;

        $scope.closeOptionsBox = function () {
            $scope.showOptionsAccountRef = false;
        };

        $scope.toggleCurrenciesOptions = function () {
            $scope.showOptionsAccountRef = !$scope.showOptionsAccountRef;
        };

        vm.getWarmstorage = function (applyFilter) {
            $scope.loadingWarmstorage =  true;
            if(vm.token) {
                $http.get(vm.serviceUrl + 'admin/warmstorage/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $scope.warmstorageObj = res.data.data;
                        if(applyFilter){
                            $scope.getLatestWarmstorageTransactions('applyFilter');
                        } else {
                            $scope.getLatestWarmstorageTransactions();
                        }
                    }
                }).catch(function (error) {
                    $scope.loadingWarmstorage =  false;
                    $scope.transactionsWarmstorageStateMessage = 'Failed to load data';
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        vm.getWarmstorage();

        //Public address logic

        $scope.warmStoragePublicAddressPagination = {
            itemsPerPage: 3,
            pageNo: 1,
            maxSize: 5
        };

        vm.getWarmStoragePublicAddressUrl = function(){

            var searchObj = {
                page: $scope.warmStoragePublicAddressPagination.pageNo,
                page_size: $scope.warmStoragePublicAddressPagination.itemsPerPage
            };

            return vm.serviceUrl + 'admin/warmstorage/accounts/?' +
                serializeFiltersService.serializeFilters(cleanObject.cleanObj(searchObj));
        };

        $scope.getWarmStoragePublicAddresses = function () {
            if(vm.token) {
                $scope.loadingWarmStoragePublicAddresses = true;
                var publicAddressUrl = vm.getWarmStoragePublicAddressUrl();

                $http.get(publicAddressUrl, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $scope.loadingWarmStoragePublicAddresses = false;
                        $scope.warmStoragePublicAddressData = res.data.data;
                        $scope.warmStoragePublicAddressesList = $scope.warmStoragePublicAddressData.results;
                    }
                }).catch(function (error) {
                    $scope.loadingWarmStoragePublicAddresses = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        $scope.getWarmStoragePublicAddresses();

        $scope.addWarmStoragePublicAddressModal = function (page,size) {
            vm.thePublicAddressModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'AddStellarTestnetWarmstoragePublicAddressModalCtrl'
            });

            vm.thePublicAddressModal.result.then(function(address){
                if(address){
                    $scope.getWarmStoragePublicAddresses();
                }
            }, function(){
            });
        };

        //Public address logic ends

        //transactions logic

        $scope.showingWarmstorageFilters = false;
        $scope.dateFilterWarmstorageOptions = ['Is in the last','In between','Is equal to','Is after','Is before'];
        $scope.amountFilterWarmstorageOptions = ['Is equal to','Is between','Is greater than','Is less than'];
        $scope.dateFilterIntervalWarmstorageOptions = ['days','months'];
        $scope.filtersWarmstorageCount = 0;
        $scope.filtersWarmstorageObj = {
            dateFilter: false,
            amountFilter: false,
            statusFilter: false,
            transactionTypeFilter: false,
            transactionIdFilter: false,
            pageSizeFilter: false,
            orderByFilter: false
        };
        $scope.applyFiltersWarmstorageObj = {
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
        $scope.warmstoragePagination = {
            itemsPerPage: 26,
            pageNo: 1,
            maxSize: 5
        };
        $scope.transactionsWarmstorage = [];
        $scope.transactionsWarmstorageStateMessage = '';
        $scope.transactionsWarmstorageData = {};
        $scope.typeOptionsWarmstorage = ['Credit','Debit']; //Transfer
        $scope.statusOptionsWarmstorage = ['Pending','Complete','Failed','Deleted'];
        $scope.orderByOptionsWarmstorage = ['Latest','Largest','Smallest'];

        sharedResources.getSubtypes().then(function (res) {
            $scope.subtypeOptionsWarmstorage = _.pluck(res,'name');
            $scope.subtypeOptionsWarmstorage.unshift('');
        });

        //for angular datepicker
        $scope.dateObjWarmstorage = {};
        $scope.dateObjWarmstorage.format = $scope.companyDateFormatString;
        $scope.popup1Warmstorage = {};
        $scope.open1Warmstorage = function() {
            $scope.popup1Warmstorage.opened = true;
        };

        $scope.popup2Warmstorage = {};
        $scope.open2Warmstorage = function() {
            $scope.popup2Warmstorage.opened = true;
        };
        //for angular datepicker end

        $scope.orderByFunctionWarmstorage = function () {
            return ($scope.applyFiltersWarmstorageObj.orderByFilter.selectedOrderByOption == 'Latest' ? '-created' :
                $scope.applyFiltersWarmstorageObj.orderByFilter.selectedOrderByOption == 'Largest' ? '-amount' :
                    $scope.applyFiltersWarmstorageObj.orderByFilter.selectedOrderByOption == 'Smallest' ? 'amount' : '');
        };

        $scope.pageSizeChangedWarmstorage =  function () {
            if($scope.warmstoragePagination.itemsPerPage > 250){
                $scope.warmstoragePagination.itemsPerPage = 250;
            }
        };

        $scope.showWarmstorageFilters = function () {
            $scope.showingWarmstorageFilters = !$scope.showingWarmstorageFilters;
        };

        $scope.clearWarmstorageFilters = function () {
            $scope.filtersWarmstorageObj = {
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

        $scope.dayIntervalChangedWarmstorage = function () {
            if($scope.applyFiltersWarmstorageObj.dateFilter.dayInterval <= 0){
                toastr.success('Please enter a positive value');
            }
        };

        vm.getDateFiltersWarmstorageObj = function () {
            var evaluatedDateObj = multiOptionsFilterService.evaluatedDates($scope.applyFiltersWarmstorageObj.dateFilter);

            return {
                created__lt: evaluatedDateObj.date__lt,
                created__gt: evaluatedDateObj.date__gt
            };
        };

        vm.getAmountFiltersWarmstorage = function () {
            var evaluatedAmountObj = multiOptionsFilterService.evaluatedAmounts($scope.applyFiltersWarmstorageObj.amountFilter);

            return {
                amount: evaluatedAmountObj.amount,
                amount__lt: evaluatedAmountObj.amount__lt,
                amount__gt: evaluatedAmountObj.amount__gt
            };
        };

        vm.getTransactionWarmstorageUrl = function(){
            $scope.filtersWarmstorageCount = 0;

            for(var x in $scope.filtersWarmstorageObj){
                if($scope.filtersWarmstorageObj.hasOwnProperty(x)){
                    if($scope.filtersWarmstorageObj[x]){
                        $scope.filtersWarmstorageCount = $scope.filtersWarmstorageCount + 1;
                    }
                }
            }

            if($scope.filtersWarmstorageObj.dateFilter){
                vm.dateObjWarmstorage = vm.getDateFiltersWarmstorageObj();
            } else{
                vm.dateObjWarmstorage = {
                    created__lt: null,
                    created__gt: null
                };
            }

            if($scope.filtersWarmstorageObj.amountFilter){
                vm.amountObj = vm.getAmountFiltersWarmstorage();
            } else{
                vm.amountObj = {
                    amount: null,
                    amount__lt: null,
                    amount__gt: null
                };
            }

            var searchObj = {
                page: $scope.warmstoragePagination.pageNo,
                page_size: $scope.filtersWarmstorageObj.pageSizeFilter? $scope.warmstoragePagination.itemsPerPage : 26,
                amount: vm.amountObj.amount ? currencyModifiers.convertToCents(vm.amountObj.amount,8) : null,
                amount__lt: vm.amountObj.amount__lt ? currencyModifiers.convertToCents(vm.amountObj.amount__lt,8) : null,
                amount__gt: vm.amountObj.amount__gt ? currencyModifiers.convertToCents(vm.amountObj.amount__gt,8) : null,
                created__gt: vm.dateObjWarmstorage.created__gt ? Date.parse(vm.dateObjWarmstorage.created__gt +'T00:00:00') : null,
                created__lt: vm.dateObjWarmstorage.created__lt ? Date.parse(vm.dateObjWarmstorage.created__lt +'T00:00:00') : null,
                account: $scope.warmstorageObj.rehive_account_reference,
                orderby: $scope.filtersWarmstorageObj.orderByFilter ? ($scope.applyFiltersWarmstorageObj.orderByFilter.selectedOrderByOption == 'Latest' ? '-created' : $scope.applyFiltersWarmstorageObj.orderByFilter.selectedOrderByOption == 'Largest' ? '-amount' : $scope.applyFiltersWarmstorageObj.orderByFilter.selectedOrderByOption == 'Smallest' ? 'amount' : null): null,
                id: $scope.filtersWarmstorageObj.transactionIdFilter ? ($scope.applyFiltersWarmstorageObj.transactionIdFilter.selectedTransactionIdOption ? encodeURIComponent($scope.applyFiltersWarmstorageObj.transactionIdFilter.selectedTransactionIdOption) : null): null,
                tx_type: $scope.filtersWarmstorageObj.transactionTypeFilter ? $scope.applyFiltersWarmstorageObj.transactionTypeFilter.selectedTransactionTypeOption.toLowerCase() : null,
                status: $scope.filtersWarmstorageObj.statusFilter ? $scope.applyFiltersWarmstorageObj.statusFilter.selectedStatusOption: null,
                subtype: $scope.filtersWarmstorageObj.transactionTypeFilter ? ($scope.applyFiltersWarmstorageObj.transactionSubtypeFilter.selectedTransactionSubtypeOption ? $scope.applyFiltersWarmstorageObj.transactionSubtypeFilter.selectedTransactionSubtypeOption: null): null
            };

            return environmentConfig.API + 'admin/transactions/?' + serializeFiltersService.serializeFilters(searchObj);
        };

        $scope.getLatestWarmstorageTransactions = function(applyFilter){
            if(vm.token) {
                $scope.loadingWarmstorage =  true;
                $scope.showingWarmstorageFilters = false;

                $scope.transactionsWarmstorageStateMessage = '';

                if (applyFilter) {
                    // if function is called from history-filters directive, then pageNo set to 1
                    $scope.warmstoragePagination.pageNo = 1;
                }

                if ($scope.transactionsWarmstorage.length > 0) {
                    $scope.transactionsWarmstorage.length = 0;
                }

                var transactionsUrl = vm.getTransactionWarmstorageUrl();

                $http.get(transactionsUrl, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingWarmstorage =  false;
                    if (res.status === 200) {
                        $scope.transactionsWarmstorageData = res.data.data;
                        $scope.transactionsWarmstorage = $scope.transactionsWarmstorageData.results;
                        if ($scope.transactionsWarmstorage.length == 0) {
                            $scope.loadingHotwalletTransactions =  false;
                            $scope.transactionsWarmstorageStateMessage = 'No transactions have been found';
                            return;
                        }

                        $scope.transactionsWarmstorageStateMessage = '';
                    }
                }).catch(function (error) {
                    $scope.loadingWarmstorage =  false;
                    $scope.transactionsWarmstorageStateMessage = 'Failed to load data';
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.refreshWarmstoragePage = function () {
            vm.getWarmstorage('applyFilter');
        };

        $scope.openWarmstorageModal = function (page, size,transaction) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'StellarTestnetWarmstorageTransactionModalCtrl',
                resolve: {
                    transaction: function () {
                        return transaction;
                    },
                    uuid: function () {
                        return $scope.warmstorageObj.user_account_identifier;
                    }
                }
            });

            vm.theModal.result.then(function(transaction){
                if(transaction){
                    $scope.clearWarmstorageFilters();
                    $scope.getLatestWarmstorageTransactions();
                }
            }, function(){
            });
        };


    }
})();
