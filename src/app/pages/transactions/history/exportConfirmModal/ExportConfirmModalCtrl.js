(function () {
    'use strict';

    angular.module('BlurAdmin.pages.transactions.history')
        .controller('ExportConfirmModalCtrl', ExportConfirmModalCtrl);

    function ExportConfirmModalCtrl($scope,$filter,exportTransactionsList,filtersObjForExport,serializeFiltersService) {

        var vm = this;
        $scope.exportTransactionsList = exportTransactionsList;
        delete filtersObjForExport.page;
        delete filtersObjForExport.page_size;
        $scope.filtersObjForExport = serializeFiltersService.objectFilters(filtersObjForExport);
        $scope.numberOfResults =  $scope.exportTransactionsList.length;
        $scope.filtersTexts = 'for';
        $scope.filtersTextsArray = [];

        vm.filtersObjToText = function () {
            for(var key in $scope.filtersObjForExport){
                if($scope.filtersObjForExport.hasOwnProperty(key)) {
                    if(key == 'created__gt'){
                        $scope.filtersObjForExport[key] = $filter("date")($scope.filtersObjForExport[key],'mediumDate') + ' ' + $filter("date")($scope.filtersObjForExport[key],'shortTime');
                        $scope.filtersTextsArray.push('date greater than ' + $scope.filtersObjForExport[key]);
                    } else if(key == 'created__lt'){
                        $scope.filtersObjForExport[key] = $filter("date")($scope.filtersObjForExport[key],'mediumDate') + ' ' + $filter("date")($scope.filtersObjForExport[key],'shortTime');
                        $scope.filtersTextsArray.push('date less than ' + $scope.filtersObjForExport[key]);
                    }
                }
            }
        };
        vm.filtersObjToText();

        // for CSV starts

        $scope.getFileName = $filter('date')(Date.now(),'mediumDate') + ' ' + $filter('date')(Date.now(),'shortTime') + '-transactionsHistory.csv';

        $scope.getHeader = function () {return ["Id", "User","Recipient","Balance","Type","Currency", "Amount",
            "Fee","Subtype","Account","Status","Date","Reference","Note","Metadata"];};

        //To do: fix header names

        $scope.getCSVArray = function () {
            var array = [];
            $scope.exportTransactionsList.forEach(function (element) {
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
                    user: element.user,
                    recipient: element.recipient,
                    balance: element.balance.toString(),
                    type: element.tx_type,
                    currency: element.currencyCode,
                    amount: element.amount,
                    fee: element.fee.toString(),
                    subtype: element.subtype,
                    account: element.account,
                    status: element.status,
                    date: element.createdDate,
                    reference: element.reference,
                    note: element.note,
                    metadata: metadata
                });
            });

            return array;
        };

        // for CSV ends

    }
})();
