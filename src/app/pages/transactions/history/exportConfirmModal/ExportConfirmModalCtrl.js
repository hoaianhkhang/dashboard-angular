(function () {
    'use strict';

    angular.module('BlurAdmin.pages.transactions.history')
        .controller('ExportConfirmModalCtrl', ExportConfirmModalCtrl);

    function ExportConfirmModalCtrl($scope,environmentConfig,$filter,filtersObjForExport,localStorageManagement,
                                    $http,currenciesList,serializeFiltersService,errorHandler,toastr) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');

        delete filtersObjForExport.page;
        delete filtersObjForExport.page_size;
        $scope.filtersObjForExportDeepCopy = Object.assign({}, serializeFiltersService.objectFilters(filtersObjForExport));
        $scope.filtersObjForExport = serializeFiltersService.objectFilters(filtersObjForExport);
        $scope.transactionSetResponse =  {};
        $scope.filtersTextsArray = [];
        $scope.filterCurrencyObj = {};
        $scope.currencyObjectsList = currenciesList.slice();
        $scope.exportingTransactions = false;
        $scope.transactionsExported = false;

        vm.getCompanyCurrencies = function(){
            if(vm.token){
                $scope.exportingTransactions = true;
                $http.get(environmentConfig.API + '/admin/currencies/?enabled=true&page_size=250', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        if(res.data.data.results.length > 0){
                            $scope.currenciesList = res.data.data.results;
                            if($scope.filtersObjForExport.currency){
                                $scope.filterCurrencyObj = $scope.currenciesList.find(function (element) {
                                    return (element.code == $scope.filtersObjForExport.currency);
                                });
                            }
                            vm.filtersObjToText();
                        } else {
                            vm.filtersObjToText();
                        }
                    }
                }).catch(function (error) {
                    $scope.exportingTransactions = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        vm.getCompanyCurrencies();

        vm.filtersObjToText = function () {
            for(var key in $scope.filtersObjForExport){
                if($scope.filtersObjForExport.hasOwnProperty(key)) {
                    if(key == 'created__gt'){
                        $scope.filtersObjForExport[key] = $filter("date")($scope.filtersObjForExport[key],'mediumDate') + ' ' + $filter("date")($scope.filtersObjForExport[key],'shortTime');
                        $scope.filtersTextsArray.push('Date greater than: ' + $scope.filtersObjForExport[key]);
                    } else if(key == 'created__lt'){
                        $scope.filtersObjForExport[key] = $filter("date")($scope.filtersObjForExport[key],'mediumDate') + ' ' + $filter("date")($scope.filtersObjForExport[key],'shortTime');
                        $scope.filtersTextsArray.push('Date less than: ' + $scope.filtersObjForExport[key]);
                    } else if(key == 'currency'){
                        $scope.filtersTextsArray.push('Currency: ' + $scope.filtersObjForExport[key]);
                    } else if(key == 'amount'){
                        $scope.filtersTextsArray.push('Amount: ' + $filter("currencyModifiersFilter")($scope.filtersObjForExport[key],$scope.filterCurrencyObj.divisibility));
                    } else if(key == 'amount__gt'){
                        $scope.filtersTextsArray.push('Amount greater than: ' + $filter("currencyModifiersFilter")($scope.filtersObjForExport[key],$scope.filterCurrencyObj.divisibility));
                    } else if(key == 'amount__lt'){
                        $scope.filtersTextsArray.push('Amount less than: ' + $filter("currencyModifiersFilter")($scope.filtersObjForExport[key],$scope.filterCurrencyObj.divisibility));
                    } else if(key == 'status'){
                        $scope.filtersTextsArray.push('Status: ' + $scope.filtersObjForExport[key]);
                    } else if(key == 'tx_type'){
                        $scope.filtersTextsArray.push('Transaction type: ' + $scope.filtersObjForExport[key]);
                    } else if(key == 'id'){
                        $scope.filtersTextsArray.push('Transaction id: ' + $scope.filtersObjForExport[key]);
                    } else if(key == 'subtype'){
                        $scope.filtersTextsArray.push('Subtype: ' + $scope.filtersObjForExport[key]);
                    } else if(key == 'destination_transaction'){
                        $scope.filtersTextsArray.push('Has destination transaction');
                    } else if(key == 'source_transaction'){
                        $scope.filtersTextsArray.push('Has source transaction');
                    } else if(key == 'user'){
                        $scope.filtersTextsArray.push('User: ' + decodeURIComponent($scope.filtersObjForExport[key]));
                    } else if(key == 'account'){
                        $scope.filtersTextsArray.push('Account: ' + $scope.filtersObjForExport[key]);
                    } else if(key == 'group'){
                        $scope.filtersTextsArray.push('Group: ' + $scope.filtersObjForExport[key]);
                    } else if(key == 'group__isnull'){
                        $scope.filtersObjForExport[key] == 'true' ? $scope.filtersTextsArray.push('Users with no group') : $scope.filtersTextsArray.push('Users with group');
                    }
                }
            }
            $scope.exportingTransactions = false;
        };

        $scope.exportTransansactionsSet = function() {
            $scope.exportingTransactions = true;
            $http.post(environmentConfig.API + '/admin/transactions/sets/',{
                page_size: 10000,
                query: $scope.filtersObjForExportDeepCopy
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                if (res.status === 201) {
                    $scope.exportingTransactions = false;
                    $scope.transactionsExported = true;
                    $scope.transactionSetResponse = res.data.data;
                    toastr.success('Successfully exporting transaction sets');
                }
            }).catch(function (error) {
                $scope.exportingTransactions = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };
    }
})();
