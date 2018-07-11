(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groups.groupManagementTiers.groupTierLimits')
        .controller('AddGroupTierLimitCtrl', AddGroupTierLimitCtrl);

    function AddGroupTierLimitCtrl($scope,$uibModalInstance,sharedResources,selectedTier,toastr,currencyModifiers,
                                   $http,environmentConfig,localStorageManagement,errorHandler,_,$stateParams) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.groupName = $stateParams.groupName;
        $scope.selectedTier = selectedTier;
        $scope.addingTierLimit = false;
        $scope.loadingSubtypes = false;
        $scope.tierLimitsParams = {
            tx_type: 'credit',
            type: 'Maximum',
            subtype: ''
        };
        $scope.typeOptions = ['Maximum','Maximum per day','Maximum per month','Minimum','Overdraft'];

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
        $scope.getSubtypesArray($scope.tierLimitsParams);

        $scope.addTierLimit = function(tierLimitsParams){
            if(tierLimitsParams.value){
                if(currencyModifiers.validateCurrency(tierLimitsParams.value,tierLimitsParams.currency.divisibility)){
                    tierLimitsParams.value = currencyModifiers.convertToCents(tierLimitsParams.value,tierLimitsParams.currency.divisibility);
                } else {
                    toastr.error('Please input amount to ' + tierLimitsParams.currency.divisibility + ' decimal places');
                    return;
                }
            } else {
                tierLimitsParams.value = 0;
            }

            if(vm.token) {
                $scope.addingTierLimit = true;
                tierLimitsParams.tx_type = tierLimitsParams.tx_type.toLowerCase();
                tierLimitsParams.type = tierLimitsParams.type == 'Maximum' ? 'max': tierLimitsParams.type == 'Maximum per day' ? 'day_max':
                                                                  tierLimitsParams.type == 'Maximum per month' ? 'month_max': tierLimitsParams.type == 'Minimum' ? 'min': 'overdraft';

                tierLimitsParams.currency = tierLimitsParams.currency.code;

                $http.post(environmentConfig.API + '/admin/groups/' + vm.groupName + '/tiers/' + $scope.selectedTier.id + '/limits/',tierLimitsParams,{
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.addingTierLimit = false;
                    if (res.status === 201) {
                        toastr.success('Limit added successfully to tier');
                        $uibModalInstance.close($scope.selectedTier.level);
                    }
                }).catch(function (error) {
                    $scope.tierLimitsParams = {
                        tx_type: 'Credit',
                        type: 'Maximum',
                        subtype: ''
                    };
                    $scope.addingTierLimit = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };



    }
})();
