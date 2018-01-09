(function () {
    'use strict';

    angular.module('BlurAdmin.pages.currency.settings.tierLimits')
        .controller('TierLimitsCtrl', TierLimitsCtrl);

    /** @ngInject */
    function TierLimitsCtrl($scope,$stateParams,cookieManagement,$http,environmentConfig,_,$window,
                            sharedResources,$timeout,errorHandler,toastr,$uibModal,currencyModifiers) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
        $scope.currencyCode = $stateParams.currencyCode;
        vm.currenciesList = JSON.parse($window.sessionStorage.currenciesList || '[]');
        $scope.activeTabIndex = 0;
        $scope.loadingTierLimits = true;
        $scope.loadingSubtypes = false;
        $scope.editingTierLimits = false;
        vm.updatedTierLimit = {};
        $scope.tierLimitsParams = {
            tx_type: 'Credit',
            type: 'Maximum',
            subtype: ''
        };
        $scope.txTypeOptions = ['Credit','Debit'];
        $scope.typeOptions = ['Maximum','Maximum per day','Maximum per month','Minimum','Overdraft'];
        vm.currenciesList.forEach(function (element) {
            if(element.code ==  $scope.currencyCode){
                $scope.currencyObj = element;
            }
        });


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

        $scope.toggleTierLimitEditView = function(tierLimit){
            if(tierLimit) {
                vm.getTierLimit(tierLimit);
            } else {
                $scope.editTierLimit = {};
                $scope.getAllTiers($scope.selectedTier.level);
            }
            $scope.editingTierLimits = !$scope.editingTierLimits;
        };

        vm.getTierLimit = function (tierLimit) {
            $scope.loadingTierLimits = true;
            $http.get(environmentConfig.API + '/admin/tiers/' + $scope.selectedTier.id + '/limits/' + tierLimit.id + '/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.loadingTierLimits = false;
                if (res.status === 200) {
                    $scope.editTierLimit = res.data.data;
                    $scope.editTierLimit.value = currencyModifiers.convertFromCents($scope.editTierLimit.value,$scope.currencyObj.divisibility);
                    $scope.editTierLimit.tx_type == 'credit' ? $scope.editTierLimit.tx_type = 'Credit' : $scope.editTierLimit.tx_type = 'Debit';
                    $scope.getSubtypesArray($scope.editTierLimit,'editing');
                }
            }).catch(function (error) {
                $scope.loadingTierLimits = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        $scope.getAllTiers = function(tierLevel){
            if(vm.token) {
                $scope.loadingTierLimits = true;
                $http.get(environmentConfig.API + '/admin/tiers/?currency=' + $scope.currencyObj.code , {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingTierLimits = false;
                    if (res.status === 200) {
                        vm.unsortedTierLevelsArray = _.pluck(res.data.data ,'level');
                        vm.sortedTierLevelsArray = vm.unsortedTierLevelsArray.sort(function(a, b) {
                            return a - b;
                        });
                        $scope.tierLevelsForLimits = vm.sortedTierLevelsArray;
                        $scope.allTiers = res.data.data.sort(function(a, b) {
                            return parseFloat(a.level) - parseFloat(b.level);
                        });
                        if(tierLevel){
                          $scope.selectTier(tierLevel);
                        } else {
                          $timeout(function(){
                              $scope.activeTabIndex = 0;
                            });
                          $scope.selectTier($scope.tierLevelsForLimits[0]);
                        }
                    }
                }).catch(function (error) {
                    $scope.loadingTierLimits = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        $scope.getAllTiers();

        vm.findIndexOfTier = function(element){
            return this == element.level;
        };

        $scope.selectTier = function(tierLevel){
            $scope.editingTierLimits = false;
            var index = $scope.allTiers.findIndex(vm.findIndexOfTier,tierLevel);
            $scope.selectedTier = $scope.allTiers[index];
            if($scope.selectedTier){
                $scope.getTierLimits();
            }
        };

        $scope.getTierLimits = function(){
            if(vm.token) {
                $scope.loadingTierLimits = true;
                $http.get(environmentConfig.API + '/admin/tiers/' + $scope.selectedTier.id + '/limits/',{
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingTierLimits = false;
                    if (res.status === 200) {
                        $scope.tiersLimitsList = res.data.data;
                    }
                }).catch(function (error) {
                    $scope.loadingTierLimits = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.addTierLimit = function(tierLimitsParams){
            if(tierLimitsParams.value){
                if(currencyModifiers.validateCurrency(tierLimitsParams.value,$scope.currencyObj.divisibility)){
                    tierLimitsParams.value = currencyModifiers.convertToCents(tierLimitsParams.value,$scope.currencyObj.divisibility);
                } else {
                    toastr.error('Please input amount to ' + $scope.currencyObj.divisibility + ' decimal places');
                    return;
                }
            } else {
                tierLimitsParams.value = 0;
            }
            if(vm.token) {
                $scope.loadingTierLimits = true;
                tierLimitsParams.tx_type = tierLimitsParams.tx_type.toLowerCase();
                tierLimitsParams.type = tierLimitsParams.type == 'Maximum' ? 'max': tierLimitsParams.type == 'Maximum per day' ? 'day_max':
                                                                  tierLimitsParams.type == 'Maximum per month' ? 'month_max': tierLimitsParams.type == 'Minimum' ? 'min': 'overdraft';
                $http.post(environmentConfig.API + '/admin/tiers/' + $scope.selectedTier.id + '/limits/',tierLimitsParams,{
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingTierLimits = false;
                    if (res.status === 201) {
                        toastr.success('Limit added successfully to tier');
                        $scope.tierLimitsParams = {
                            tx_type: 'Credit',
                            type: 'Maximum',
                            subtype: ''
                        };

                        $scope.getSubtypesArray($scope.tierLimitsParams);
                        $scope.getAllTiers($scope.selectedTier.level);
                    }
                }).catch(function (error) {
                    $scope.tierLimitsParams = {
                        tx_type: 'Credit',
                        type: 'Maximum',
                        subtype: ''
                    };

                    $scope.getSubtypesArray($scope.tierLimitsParams);
                    $scope.loadingTierLimits = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.tierLimitChanged = function(field){
            vm.updatedTierLimit[field] = $scope.editTierLimit[field];
        };

        $scope.updateTierLimit = function(){

            if(!$scope.editTierLimit.subtype){
                vm.updatedTierLimit.subtype = '';
            }

            if($scope.editTierLimit.value){
                if(currencyModifiers.validateCurrency($scope.editTierLimit.value,$scope.currencyObj.divisibility)){
                    vm.updatedTierLimit.value = currencyModifiers.convertToCents($scope.editTierLimit.value,$scope.currencyObj.divisibility);
                } else {
                    toastr.error('Please input amount to ' + $scope.currencyObj.divisibility + ' decimal places');
                    return;
                }
            } else {
                vm.updatedTierLimit.value = 0;
            }

            if(vm.token) {
                $scope.loadingTierLimits = true;
                $scope.editingTierLimits = !$scope.editingTierLimits;
                vm.updatedTierLimit.tx_type ? vm.updatedTierLimit.tx_type = vm.updatedTierLimit.tx_type.toLowerCase() : '';
                vm.updatedTierLimit.type ? vm.updatedTierLimit.type = vm.updatedTierLimit.type == 'Maximum' ? 'max': vm.updatedTierLimit.type == 'Maximum per day' ? 'day_max':
                    vm.updatedTierLimit.type == 'Maximum per month' ? 'month_max': vm.updatedTierLimit.type == 'Minimum' ? 'min': 'overdraft' : '';

                $http.patch(environmentConfig.API + '/admin/tiers/' + $scope.selectedTier.id + '/limits/' + $scope.editTierLimit.id + '/',vm.updatedTierLimit,{
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingTierLimits = false;
                    if (res.status === 200) {
                        toastr.success('Limit updated successfully');
                        $scope.tierLimitsParams = {
                            tx_type: 'Credit',
                            type: 'Maximum',
                            subtype: ''
                        };
                        vm.updatedTierLimit = {};
                        $scope.getAllTiers($scope.selectedTier.level);

                    }
                }).catch(function (error) {
                    $scope.tierLimitsParams = {
                        tx_type: 'Credit',
                        type: 'Maximum',
                        subtype: ''
                    };
                    vm.updatedTierLimit = {};
                    $scope.getAllTiers($scope.selectedTier.level);
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

    vm.findIndexOfTierLimit = function(element){
        return this.id == element.id;
    };

    $scope.openTierLimitsModal = function (page, size,tierLimit) {
        vm.theModal = $uibModal.open({
            animation: true,
            templateUrl: page,
            size: size,
            controller: 'TierLimitsModalCtrl',
            scope: $scope,
            resolve: {
                tierLimit: function () {
                    return tierLimit;
                },
                selectedTier: function () {
                    return $scope.selectedTier;
                }
            }
        });

        vm.theModal.result.then(function(tierLimit){
            var index = $scope.tiersLimitsList.findIndex(vm.findIndexOfTierLimit,tierLimit);
            $scope.tiersLimitsList.splice(index, 1);
        }, function(){
        });
    };

    }
})();
