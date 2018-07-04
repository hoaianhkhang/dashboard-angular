(function () {
    'use strict';

    angular.module('BlurAdmin.pages.transactions.history')
        .controller('historyModalCtrl', historyModalCtrl);

    function historyModalCtrl($rootScope,Rehive,$uibModalInstance,$scope,errorHandler,toastr,$timeout,$anchorScroll,
                              transaction,metadataTextService,$location,localStorageManagement,$window) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        $scope.updateTransactionObj = {};
        $scope.formatted = {};
        $scope.formatted.metadata = {};
        $scope.editingTransaction = false;
        $scope.updatingTransaction = false;
        $scope.untouchedTransaction = false;
        $scope.transactionHasBeenUpdated = false;
        $scope.editTransactionStatusOptions = ['Pending','Complete','Failed'];
        $scope.retrievedUserObj = {};

        $scope.$on("modal.closing",function(){
            $rootScope.$broadcast("modalClosing",$scope.transactionHasBeenUpdated);
        });

        $scope.copiedMetadataSuccessfully= function () {
            toastr.success('Metadata copied to clipboard');
        };

        $scope.checkTransactionPurity = function () {
            $scope.untouchedTransaction = true;
        };

        $scope.getTransaction = function(){
            if(vm.token) {
                $scope.updatingTransaction = true;
                Rehive.admin.transactions.get({id: transaction.id}).then(function (res) {
                    $scope.transaction = res;
                    $scope.formatted.metadata = metadataTextService.convertToText($scope.transaction.metadata);
                    $scope.updateTransactionObj.status = $scope.transaction.status;
                    $scope.transaction.recipient = $scope.transaction.destination_transaction ? $scope.transaction.destination_transaction.id ? $scope.transaction.destination_transaction.user.email : $scope.transaction.destination_transaction.user.email + ' (new user)' : "";
                    $scope.updatingTransaction = false;
                    vm.getUserDetails($scope.transaction.user);
                    $scope.$apply();
                }, function (error) {
                    $scope.updatingTransaction = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        $scope.getTransaction();

        vm.getUserDetails = function (user) {
            if(user){
                Rehive.admin.users.get({filters: {user: user.identifier}}).then(function (res) {
                    if(res.results.length == 1){
                        $scope.retrievedUserObj = res.results[0];
                        $scope.retrievedUserObj.metadata = metadataTextService.convertToText($scope.retrievedUserObj.metadata);
                        $scope.$apply();
                    }
                }, function (error) {
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        $scope.toggleEditingTransaction = function () {
            if(!$scope.editingTransaction){
                if($scope.formatted.metadata){
                    $scope.updateTransactionObj.metadata = JSON.stringify($scope.transaction.metadata);
                } else {
                    $scope.updateTransactionObj.metadata = '';
                }

                $scope.updateTransactionObj.status = $scope.transaction.status;
                //scrolling to the bottom
                var old = $location.hash();
                $location.hash('transaction-modal-mid');
                $anchorScroll();
                $location.hash(old);
                $timeout(function () {
                    $location.hash('transaction-modal-save-button');
                    $anchorScroll();
                },30);
                $timeout(function () {
                    $location.hash(old);
                },50);

            } else {
                delete $scope.updateTransactionObj.metadata;
            }

            $scope.untouchedTransaction = false;
            $scope.editingTransaction = !$scope.editingTransaction;
        };

        $scope.updateTransactionStatus = function(){
            $scope.updatingTransaction = true;
            var metaData;
            if($scope.updateTransactionObj.metadata){
                if(vm.isJson($scope.updateTransactionObj.metadata)){
                    metaData =  JSON.parse($scope.updateTransactionObj.metadata);
                } else {
                    toastr.error('Incorrect metadata format');
                    $scope.updatingTransaction = false;
                    return false;
                }
            } else {
                metaData = {};
            }

            Rehive.admin.transactions.update($scope.transaction.id, {
                status: $scope.updateTransactionObj.status,
                metadata: metaData
            }).then(function (res) {
                if(metaData == {}){
                    delete $scope.formatted.metadata;
                    delete $scope.transaction.metadata;
                } else {
                    $scope.transaction.metadata = metaData;
                    $scope.formatted.metadata = metadataTextService.convertToText(metaData);
                }

                $timeout(function () {
                    $scope.transactionHasBeenUpdated = true;
                    $scope.toggleEditingTransaction();
                    $scope.updatingTransaction = false;
                    toastr.success('Transaction successfully updated');
                    $scope.$apply();
                },800);
            }, function (error) {
                $scope.updatingTransaction = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

        vm.isJson = function (str) {
            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }
            return true;
        };

        $scope.goToUser = function () {
            $uibModalInstance.close();
            $window.open('/#/user/' + $scope.transaction.user.identifier + '/details','_blank');
        };


    }
})();
