(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groups.groupManagementTiers.groupTierFees')
        .controller('AddGroupTierFeeModalCtrl', AddGroupTierFeeModalCtrl);

    function AddGroupTierFeeModalCtrl($scope,$uibModalInstance,currencyModifiers,selectedTier,toastr,_,
                                      Rehive,localStorageManagement,errorHandler,$stateParams,sharedResources) {

        var vm = this;
        $scope.selectedTier = selectedTier;
        $scope.addingTierFees = false;
        $scope.loadingSubtypes = false;
        vm.groupName = ($stateParams.groupName == 'extension') ? 'service' : $stateParams.groupName;
        vm.token = localStorageManagement.getValue('token');
        $scope.tierFeesParams = {
            tx_type: 'credit',
            subtype: ''
        };

        vm.getCompanyCurrencies = function(){
            if(vm.token){
                Rehive.admin.currencies.get({filters: {
                    archived: false,
                    page_size: 250
                }}).then(function (res) {
                    $scope.currenciesOptions = res.results;
                    $scope.$apply();
                }, function (error) {
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
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
                res = res.filter(function (element) {
                    return element.tx_type == (params.tx_type).toLowerCase();
                });
                $scope.subtypeOptions = _.pluck(res,'name');
                $scope.subtypeOptions.unshift('');
                $scope.loadingSubtypes = false;
                $scope.$apply();
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
                Rehive.admin.groups.tiers.fees.create(vm.groupName,$scope.selectedTier.id, tierFeesParams).then(function (res) {
                    $scope.addingTierFees = false;
                    toastr.success('Fee added successfully to tier');
                    $uibModalInstance.close($scope.selectedTier.level);
                    $scope.$apply();
                }, function (error) {
                    $scope.tierFeesParams = {
                        tx_type: 'Credit',
                        subtype: ''
                    };
                    $scope.addingTierFees = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };



    }
})();
