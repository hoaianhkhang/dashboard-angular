(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.ethereumService.ethereumServiceAccounts')
        .controller('EthereumColdstorageCtrl', EthereumColdstorageCtrl);

    /** @ngInject */
    function EthereumColdstorageCtrl($scope,localStorageManagement,errorHandler,currenciesList,$http,$uibModal,$location,multiOptionsFilterService,
                                    cleanObject,sharedResources,_,environmentConfig,currencyModifiers,toastr,serializeFiltersService) {

        var vm = this;
        // vm.serviceUrl = localStorageManagement.getValue('SERVICEURL');
        vm.serviceUrl = "https://ethereum.services.rehive.io/api/1/";
        vm.token = localStorageManagement.getValue('TOKEN');
        $scope.companyDateFormatString = localStorageManagement.getValue('DATE_FORMAT');
        $scope.ethereumCurrency = currenciesList.find(function (element) {
            return element.code == 'ETH';
        });
        $scope.showOptionsAccountRef = false;
        $scope.loadingColdstorage = true;

        $scope.closeOptionsBox = function () {
            $scope.showOptionsAccountRef = false;
        };

        $scope.toggleCurrenciesOptions = function () {
            $scope.showOptionsAccountRef = !$scope.showOptionsAccountRef;
        };

        vm.getColdstorage = function (applyFilter) {
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
                        if(applyFilter){
                            $scope.getLatestColdstorageTransactions('applyFilter');
                        } else {
                            $scope.getLatestColdstorageTransactions();
                        }
                    }
                }).catch(function (error) {
                    $scope.loadingColdstorage =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        vm.getColdstorage();

        //Public address logic

        $scope.publicAddressPagination = {
            itemsPerPage: 3,
            pageNo: 1,
            maxSize: 5
        };

        vm.getPublicAddressUrl = function(){

            var searchObj = {
                page: $scope.publicAddressPagination.pageNo,
                page_size: $scope.publicAddressPagination.itemsPerPage
            };

            return vm.serviceUrl + 'admin/coldstorage/public-addresses/?' +
                serializeFiltersService.serializeFilters(cleanObject.cleanObj(searchObj));
        };

        $scope.getPublicAddresses = function () {
            if(vm.token) {
                $scope.loadingPublicAddresses = true;
                var publicAddressUrl = vm.getPublicAddressUrl();

                $http.get(publicAddressUrl, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $scope.loadingPublicAddresses = false;
                        $scope.publicAddressData = res.data.data;
                        $scope.publicAddressesList = $scope.publicAddressData.results;
                    }
                }).catch(function (error) {
                    $scope.loadingPublicAddresses = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        $scope.getPublicAddresses();

        $scope.addPublicAddressModal = function (page,size) {
            vm.thePublicAddressModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'AddPublicAddressModalCtrl'
            });

            vm.thePublicAddressModal.result.then(function(address){
                if(address){
                    $scope.getPublicAddresses();
                }
            }, function(){
            });
        };

        //Public address logic ends

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
            itemsPerPage: 8,
            pageNo: 1,
            maxSize: 5
        };
        $scope.transactionsColdstorage = [];
        $scope.transactionsColdstorageStateMessage = '';
        $scope.transactionsColdstorageData = {};
        $scope.typeOptionsColdstorage = ['Credit','Debit']; //Transfer
        $scope.statusOptionsColdstorage = ['Pending','Complete','Failed','Deleted'];
        $scope.orderByOptionsColdstorage = ['Latest','Largest','Smallest'];

        sharedResources.getSubtypes().then(function (res) {
            $scope.subtypeOptionsColdstorage = _.pluck(res,'name');
            $scope.subtypeOptionsColdstorage.unshift('');
        });

        //for angular datepicker
        $scope.dateObjColdstorage = {};
        $scope.dateObjColdstorage.format = $scope.companyDateFormatString;
        $scope.popup1Coldstorage = {};
        $scope.open1Coldstorage = function() {
            $scope.popup1Coldstorage.opened = true;
        };

        $scope.popup2Coldstorage = {};
        $scope.open2Coldstorage = function() {
            $scope.popup2Coldstorage.opened = true;
        };
        //for angular datepicker end

        $scope.orderByFunctionColdstorage = function () {
            return ($scope.applyFiltersColdstorageObj.orderByFilter.selectedOrderByOption == 'Latest' ? '-created' :
                $scope.applyFiltersColdstorageObj.orderByFilter.selectedOrderByOption == 'Largest' ? '-amount' :
                    $scope.applyFiltersColdstorageObj.orderByFilter.selectedOrderByOption == 'Smallest' ? 'amount' : '');
        };

        $scope.pageSizeChangedColdstorage =  function () {
            if($scope.coldstoragePagination.itemsPerPage > 250){
                $scope.coldstoragePagination.itemsPerPage = 250;
            }
        };

        $scope.showColdstorageFilters = function () {
            $scope.showingColdstorageFilters = !$scope.showingColdstorageFilters;
        };

        $scope.clearColdstorageFilters = function () {
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

        $scope.dayIntervalChangedColdstorage = function () {
            if($scope.applyFiltersColdstorageObj.dateFilter.dayInterval <= 0){
                toastr.success('Please enter a positive value');
            }
        };

        vm.getDateFiltersColdstorageObj = function () {
            var evaluatedDateObj = multiOptionsFilterService.evaluatedDates($scope.applyFiltersColdstorageObj.dateFilter);

            return {
                created__lt: evaluatedDateObj.date__lt,
                created__gt: evaluatedDateObj.date__gt
            };
        };

        vm.getAmountFiltersColdstorage = function () {
            var evaluatedAmountObj = multiOptionsFilterService.evaluatedAmounts($scope.applyFiltersColdstorageObj.amountFilter);

            return {
                amount: evaluatedAmountObj.amount,
                amount__lt: evaluatedAmountObj.amount__lt,
                amount__gt: evaluatedAmountObj.amount__gt
            };
        };

        vm.getTransactionColdstorageUrl = function(){
            $scope.filtersColdstorageCount = 0;

            for(var x in $scope.filtersColdstorageObj){
                if($scope.filtersColdstorageObj.hasOwnProperty(x)){
                    if($scope.filtersColdstorageObj[x]){
                        $scope.filtersColdstorageCount = $scope.filtersColdstorageCount + 1;
                    }
                }
            }

            if($scope.filtersColdstorageObj.dateFilter){
                vm.dateObjColdstorage = vm.getDateFiltersColdstorageObj();
            } else{
                vm.dateObjColdstorage = {
                    created__lt: null,
                    created__gt: null
                };
            }

            if($scope.filtersColdstorageObj.amountFilter){
                vm.amountObj = vm.getAmountFiltersColdstorage();
            } else{
                vm.amountObj = {
                    amount: null,
                    amount__lt: null,
                    amount__gt: null
                };
            }

            var searchObj = {
                page: $scope.coldstoragePagination.pageNo,
                page_size: $scope.filtersColdstorageObj.pageSizeFilter? $scope.coldstoragePagination.itemsPerPage : 8,
                amount: vm.amountObj.amount ? currencyModifiers.convertToCents(vm.amountObj.amount,8) : null,
                amount__lt: vm.amountObj.amount__lt ? currencyModifiers.convertToCents(vm.amountObj.amount__lt,8) : null,
                amount__gt: vm.amountObj.amount__gt ? currencyModifiers.convertToCents(vm.amountObj.amount__gt,8) : null,
                created__gt: vm.dateObjColdstorage.created__gt ? Date.parse(vm.dateObjColdstorage.created__gt +'T00:00:00') : null,
                created__lt: vm.dateObjColdstorage.created__lt ? Date.parse(vm.dateObjColdstorage.created__lt +'T00:00:00') : null,
                account: $scope.coldstorageObj.rehive_account_reference,
                orderby: $scope.filtersColdstorageObj.orderByFilter ? ($scope.applyFiltersColdstorageObj.orderByFilter.selectedOrderByOption == 'Latest' ? '-created' : $scope.applyFiltersColdstorageObj.orderByFilter.selectedOrderByOption == 'Largest' ? '-amount' : $scope.applyFiltersColdstorageObj.orderByFilter.selectedOrderByOption == 'Smallest' ? 'amount' : null): null,
                id: $scope.filtersColdstorageObj.transactionIdFilter ? ($scope.applyFiltersColdstorageObj.transactionIdFilter.selectedTransactionIdOption ? encodeURIComponent($scope.applyFiltersColdstorageObj.transactionIdFilter.selectedTransactionIdOption) : null): null,
                tx_type: $scope.filtersColdstorageObj.transactionTypeFilter ? $scope.applyFiltersColdstorageObj.transactionTypeFilter.selectedTransactionTypeOption.toLowerCase() : null,
                status: $scope.filtersColdstorageObj.statusFilter ? $scope.applyFiltersColdstorageObj.statusFilter.selectedStatusOption: null,
                subtype: $scope.filtersColdstorageObj.transactionTypeFilter ? ($scope.applyFiltersColdstorageObj.transactionSubtypeFilter.selectedTransactionSubtypeOption ? $scope.applyFiltersColdstorageObj.transactionSubtypeFilter.selectedTransactionSubtypeOption: null): null
            };

            return environmentConfig.API + '/admin/transactions/?' + serializeFiltersService.serializeFilters(cleanObject.cleanObj(searchObj));
        };

        $scope.getLatestColdstorageTransactions = function(applyFilter){
            if(vm.token) {
                $scope.loadingColdstorage = true;
                $scope.showingColdstorageFilters = false;

                $scope.transactionsColdstorageStateMessage = '';

                if (applyFilter) {
                    // if function is called from history-filters directive, then pageNo set to 1
                    $scope.coldstoragePagination.pageNo = 1;
                }

                if ($scope.transactionsColdstorage.length > 0) {
                    $scope.transactionsColdstorage.length = 0;
                }

                var transactionsUrl = vm.getTransactionColdstorageUrl();

                $http.get(transactionsUrl, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingColdstorage = false;
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
                    $scope.transactionsColdstorageStateMessage = 'Failed to load data';
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.refreshColdstoragePage = function () {
            vm.getColdstorage('applyFilter');
        };

        $scope.goToCredit = function () {
            $location.path('/transactions/history').search({
                txType: 'credit',
                currencyCode: 'ETH',
                userIdentity: $scope.coldstorageObj.user_account_identifier,
                accountUser: $scope.coldstorageObj.rehive_account_reference
            });
        };

        $scope.goToDebit = function () {
            $location.path('/transactions/history').search({
                txType: 'debit',
                currencyCode: 'ETH',
                userIdentity: $scope.coldstorageObj.user_account_identifier,
                accountUser: $scope.coldstorageObj.rehive_account_reference
            });
        };

        $scope.openColdstorageModal = function (page, size,transaction) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'ColdstorageTransactionModalCtrl',
                resolve: {
                    transaction: function () {
                        return transaction;
                    },
                    uuid: function () {
                        return $scope.coldstorageObj.user_account_identifier;
                    }
                }
            });

            vm.theModal.result.then(function(transaction){
                if(transaction){
                    $scope.clearColdstorageFilters();
                    $scope.getLatestColdstorageTransactions();
                }
            }, function(){
            });
        };


    }
})();
