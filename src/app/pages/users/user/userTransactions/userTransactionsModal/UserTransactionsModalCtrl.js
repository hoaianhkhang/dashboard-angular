(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user.transactions')
        .controller('UserTransactionsModalCtrl', UserTransactionsModalCtrl);

    function UserTransactionsModalCtrl($uibModalInstance,$http,$scope,errorHandler,$state,
                                       toastr,transaction,metadataTextService,$location,environmentConfig,cookieManagement,$ngConfirm) {

        $scope.transaction = transaction;
        $scope.updateTransactionObj = {};
        $scope.formatted = {};
        $scope.formatted.metadata = metadataTextService.convertToText($scope.transaction.metadata);
        $scope.editingTransaction = false;
        $scope.updatingTransaction = false;

        var vm = this;
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

        $scope.updateTransactionConfirm = function (status) {
            $ngConfirm({
                title: 'Update transaction',
                content: 'Are you sure you want to edit this transaction?',
                animationBounce: 1,
                animationSpeed: 100,
                scope: $scope,
                buttons: {
                    close: {
                        text: "No",
                        btnClass: 'btn-default dashboard-btn'
                    },
                    ok: {
                        text: "Yes",
                        btnClass: 'btn-primary dashboard-btn',
                        keys: ['enter'], // will trigger when enter is pressed
                        action: function(scope){
                            $scope.updateTransactionStatus(status);
                        }
                    }
                }
            });
        };

        $scope.updateTransactionStatus = function(status){
            $scope.updatingTransaction = true;
            $http.patch(environmentConfig.API + '/admin/transactions/' + $scope.transaction.id + '/', { status: status },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                if (res.status === 200) {
                    $scope.updatingTransaction = false;
                    if(status == 'Complete'){
                        toastr.success('Transaction successfully updated, marked as Complete');
                    } else {
                        toastr.success('Transaction successfully updated, marked as Failed');
                    }
                    $uibModalInstance.close($scope.transaction);
                }
            }).catch(function (error) {
                $scope.updatingTransaction = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        $scope.goToUser = function () {
            $uibModalInstance.close();
            $location.path('/user/' + $scope.transaction.user.identifier + '/details');
        };


        $scope.goToTransactions = function(rehiveCode){
            $uibModalInstance.close();
            $state.go('transactions.history',{"transactionId": rehiveCode});
        };
    }
})();
