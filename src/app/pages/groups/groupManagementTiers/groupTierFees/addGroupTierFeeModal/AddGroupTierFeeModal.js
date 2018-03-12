(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groupTiers.tierFees')
        .controller('AddGroupTierFeeModal', AddGroupTierFeeModal);

    function AddGroupTierFeeModal($scope,$uibModalInstance,tierFee,selectedTier,toastr,$http,environmentConfig,cookieManagement,errorHandler) {

        var vm = this;
        $scope.tierFee = tierFee;
        $scope.selectedTier = selectedTier;
        $scope.deletingTierFees = false;
        vm.token = cookieManagement.getCookie('TOKEN');

        $scope.addTierFee = function(tierFeesParams){
            if(tierFeesParams.value){
                if(currencyModifiers.validateCurrency(tierFeesParams.value,tierFeesParams.currency.divisibility)){
                    tierFeesParams.value = currencyModifiers.convertToCents(tierFeesParams.value,tierFeesParams.currency.divisibility);
                } else {
                    toastr.error('Please input amount to ' + tierFeesParams.currency.divisibility + ' decimal places');
                    return;
                }
            }

            if(!tierFeesParams.percentage){
                tierFeesParams.percentage = 0;
            }
            if(vm.token) {
                $scope.loadingTierFees = true;
                tierFeesParams.tx_type = tierFeesParams.tx_type.toLowerCase();
                tierFeesParams.currency = tierFeesParams.currency.code;

                $http.post(environmentConfig.API + '/admin/groups/' + vm.groupName + '/tiers/' + $scope.selectedTier.id + '/fees/',tierFeesParams,{
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingTierFees = false;
                    if (res.status === 201) {
                        toastr.success('Fee added successfully to tier');
                        $scope.tierFeesParams = {
                            tx_type: 'Credit',
                            subtype: ''
                        };
                        $scope.getSubtypesArray($scope.tierFeesParams);
                        $scope.getAllTiers($scope.selectedTier.level);
                    }
                }).catch(function (error) {
                    $scope.tierFeesParams = {
                        tx_type: 'Credit',
                        subtype: ''
                    };
                    $scope.getSubtypesArray($scope.tierFeesParams);
                    $scope.loadingTierFees = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };



    }
})();
