(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groups.groupManagementTiers.groupTierFees')
        .controller('AddGroupTierFeeModalCtrl', AddGroupTierFeeModalCtrl);

    function AddGroupTierFeeModalCtrl($scope,$uibModalInstance,currencyModifiers,selectedTier,toastr,$http,_,
                                      environmentConfig,localStorageManagement,errorHandler,$stateParams,sharedResources) {

        var vm = this;
        $scope.selectedTier = selectedTier;
        $scope.addingTierFees = false;
        $scope.loadingSubtypes = false;
        vm.groupName = $stateParams.groupName;
        vm.token = localStorageManagement.getValue('TOKEN');
        $scope.tierFeesParams = {
            tx_type: 'Credit',
            subtype: ''
        };
        $scope.txTypeOptions = ['Credit','Debit'];

        vm.getCompanyCurrencies = function(){
            if(vm.token){
                $http.get(environmentConfig.API + '/admin/currencies/?enabled=true&page_size=250', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $scope.currenciesOptions = res.data.data.results;
                    }
                }).catch(function (error) {
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        vm.getCompanyCurrencies();

        $scope.getSubtypesArray = function(params,editing){
            $scope.loadingSubtypes = true;
            if(!editing){
                params.subtype = '';
            } else if(!params.subtype && editing){
                params.subtype = '';
            }
            sharedResources.getSubtypes().then(function (res) {
                res.data.data = res.data.data.filter(function (element) {
                    return element.tx_type == (params.tx_type).toLowerCase();
                });
                $scope.subtypeOptions = _.pluck(res.data.data,'name');
                $scope.subtypeOptions.unshift('');
                $scope.loadingSubtypes = false;
            });
        };
        $scope.getSubtypesArray($scope.tierFeesParams);

        $scope.addTierFee = function(tierFeesParams){
            if(tierFeesParams.value){
                if(currencyModifiers.validateCurrency(tierFeesParams.value,tierFeesParams.currency.divisibility)){
                    tierFeesParams.value = currencyModifiers.convertToCents(tierFeesParams.value,tierFeesParams.currency.divisibility);
                } else {
                    toastr.error('Please input amount to ' + tierFeesParams.currency.divisibility + ' decimal places');
                    return;
                }
            } else {
                tierFeesParams.value = 0;
            }

            if(!tierFeesParams.percentage){
                tierFeesParams.percentage = 0;
            }

            if(vm.token) {
                $scope.addingTierFees = true;
                tierFeesParams.tx_type = tierFeesParams.tx_type.toLowerCase();
                tierFeesParams.currency = tierFeesParams.currency.code;

                $http.post(environmentConfig.API + '/admin/groups/' + vm.groupName + '/tiers/' + $scope.selectedTier.id + '/fees/',tierFeesParams,{
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.addingTierFees = false;
                    if (res.status === 201) {
                        toastr.success('Fee added successfully to tier');
                        $uibModalInstance.close($scope.selectedTier.level);
                    }
                }).catch(function (error) {
                    $scope.tierFeesParams = {
                        tx_type: 'Credit',
                        subtype: ''
                    };
                    $scope.addingTierFees = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };



    }
})();
