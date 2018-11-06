(function () {
    'use strict';

    angular.module('BlurAdmin.pages.transactions.history')
        .controller('AddCustomMetadataModalCtrl', AddCustomMetadataModalCtrl);

    function AddCustomMetadataModalCtrl(Rehive,$uibModalInstance,$scope,errorHandler,toastr,_,
                                        transactionsMetadataColumns,$filter,localStorageManagement) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        $scope.addingCustomMetadata = false;
        $scope.transactionsMetadataColumns = transactionsMetadataColumns.slice();
        $scope.metadataOptions = transactionsMetadataColumns.slice();
        vm.companyIdentifier = localStorageManagement.getValue('companyIdentifier');
        vm.savedTransactionTableColumns = vm.companyIdentifier + 'transactionsTable';
        $scope.headerColumns = JSON.parse(localStorageManagement.getValue(vm.savedTransactionTableColumns));
        $scope.metadataToAdd = [];

        $scope.metadataInputChanges = function (query) {
            return $filter('filter')($scope.metadataOptions,query);
        };

        $scope.addMetadataColumns = function (metadataToAdd) {
            var metadataArray = _.pluck(metadataToAdd,'text');

            metadataArray.forEach(function (key) {
                var metadataExists = false;
                $scope.headerColumns.forEach(function (element) {
                    if(element.fieldName == key){
                        metadataExists = true;
                    }
                });
                if(!metadataExists){
                    $scope.headerColumns.push({colName: key,fieldName: key,visible: true,from: 'metadata'});
                }
            });

            localStorageManagement.setValue(vm.savedTransactionTableColumns,JSON.stringify($scope.headerColumns));
            $uibModalInstance.close(true);
        };


    }
})();
