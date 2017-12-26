(function () {
    'use strict';

    angular.module('BlurAdmin.pages.transactions.credit')
        .controller('PendingCreditModalCtrl', PendingCreditModalCtrl);

    /** @ngInject */
    function PendingCreditModalCtrl($uibModalInstance,$scope,$http,environmentConfig,cookieManagement,toastr,transaction,errorHandler,metadataTextService,$location) {

        var vm = this;
        $scope.transaction = transaction;
        $scope.updateTransactionObj = {};
        $scope.formatted = {};
        $scope.formatted.metadata = metadataTextService.convertToText($scope.transaction.metadata);
        $scope.editingTransaction = false;
        vm.token = cookieManagement.getCookie('TOKEN');

        $scope.editTransaction = function(){
            var metaData;
            if($scope.updateTransactionObj.metadata){
                if(vm.isJson($scope.updateTransactionObj.metadata)){
                    metaData =  JSON.parse($scope.updateTransactionObj.metadata);
                } else {
                    toastr.error('Incorrect format');
                    return false;
                }
            } else {
                metaData = " ";
            }

            if(vm.token) {
                $http.patch(environmentConfig.API + '/admin/transactions/' + $scope.transaction.id + '/',
                    {
                        metadata: metaData
                    }, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': vm.token
                        }
                    }).then(function (res) {
                    if (res.status === 200) {
                        if(metaData == " "){
                            delete $scope.formatted.metadata;
                            delete $scope.transaction.metadata
                        } else {
                            $scope.transaction.metadata = metaData;
                            $scope.formatted.metadata = metadataTextService.convertToText(metaData);
                        }

                        $scope.toggleEditingTransaction();
                        toastr.success('Transaction successfully updated');
                    }
                }).catch(function (error) {
                    $uibModalInstance.close();
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.isJson = function (str) {
            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }
            return true;
        };

        $scope.toggleEditingTransaction = function () {
            if(!$scope.editingTransaction){
                if($scope.formatted.metadata){
                    $scope.updateTransactionObj.metadata = JSON.stringify($scope.transaction.metadata);
                } else {
                    $scope.updateTransactionObj.metadata = '';
                }
            } else {
                delete $scope.updateTransactionObj.metadata;
            }

            $scope.editingTransaction = !$scope.editingTransaction;
        };

        $scope.goToUser = function () {
            $uibModalInstance.close();
            $location.path('/user/' + $scope.transaction.user.identifier + '/details');
        };

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');

        $scope.updateTransaction = function(status){
            $http.patch(environmentConfig.API + '/admin/transactions/' + $scope.transaction.id + '/', { status: status },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
            }).then(function (res) {
                if (res.status === 200) {
                    if(status == 'Complete'){
                        toastr.success('Transaction successfully updated, marked as Complete');
                    } else {
                        toastr.success('Transaction successfully updated, marked as Failed');
                    }
                    $uibModalInstance.close($scope.transaction);
                }
            }).catch(function (error) {
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };
    }
})();
