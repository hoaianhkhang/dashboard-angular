(function () {
    'use strict';

    angular.module('BlurAdmin.pages.transactions.credit')
        .controller('PendingCreditModalCtrl', PendingCreditModalCtrl);

    /** @ngInject */
    function PendingCreditModalCtrl($rootScope,$uibModalInstance,$scope,$http,environmentConfig,cookieManagement,$anchorScroll,
                                    $timeout,toastr,transaction,errorHandler,metadataTextService,$location) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
        $scope.updateTransactionObj = {};
        $scope.formatted = {};
        $scope.formatted.metadata = {};
        $scope.editingTransaction = false;
        $scope.updatingTransaction = false;
        $scope.untouchedTransaction = false;
        $scope.transactionHasBeenUpdated = false;
        $scope.editTransactionStatusOptions = ['Pending','Complete','Failed'];

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
                $http.get(environmentConfig.API + '/admin/transactions/' + transaction.id + '/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $scope.transaction = res.data.data;
                        $scope.formatted.metadata = metadataTextService.convertToText($scope.transaction.metadata);
                        $scope.updateTransactionObj.status = $scope.transaction.status;
                        $scope.updatingTransaction = false;

                    }
                }).catch(function (error) {
                    $scope.updatingTransaction = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        $scope.getTransaction();

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

            $http.patch(environmentConfig.API + '/admin/transactions/' + $scope.transaction.id + '/',
                {
                    status: $scope.updateTransactionObj.status,
                    metadata: metaData
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                if (res.status === 200) {
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
                    },800);
                }
            }).catch(function (error) {
                $scope.updatingTransaction = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
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
            $location.path('/user/' + $scope.transaction.user.identifier + '/details');
        };


    }
})();
