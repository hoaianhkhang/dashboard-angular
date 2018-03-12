(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groups.groupManagementTiers.groupTierFees')
        .controller('GroupTierFeesCtrl', GroupTierFeesCtrl);

    /** @ngInject */
    function GroupTierFeesCtrl($scope,$stateParams,cookieManagement,$http,environmentConfig,_,$window,$ngConfirm,
                          sharedResources,$timeout,errorHandler,toastr,$uibModal,currencyModifiers) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
        vm.groupName = $stateParams.groupName;
        $scope.currenciesList = JSON.parse($window.sessionStorage.currenciesList || '[]');
        $scope.activeTabIndex = 0;
        $scope.loadingTierFees = true;
        vm.updatedTierFee = {};

        vm.returnCurrencyObj = function (currencyCode) {
            return $scope.currenciesList.find(function (element) {
                return (element.code == currencyCode);
            });
        };

        $scope.getAllTiers = function(tierLevel){
            if(vm.token) {
                $scope.loadingTierFees = true;
                $http.get(environmentConfig.API + '/admin/groups/' + vm.groupName + '/tiers/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingTierFees = false;
                    if (res.status === 200) {
                        vm.unsortedTierLevelsArray = _.pluck(res.data.data ,'level');
                        vm.sortedTierLevelsArray = vm.unsortedTierLevelsArray.sort(function(a, b) {
                            return a - b;
                        });
                        $scope.tierLevelsForFees = vm.sortedTierLevelsArray;
                        $scope.allTiers = res.data.data.sort(function(a, b) {
                            return parseFloat(a.level) - parseFloat(b.level);
                        });
                        if(tierLevel){
                            $scope.selectTier(tierLevel);
                        } else {
                            $timeout(function(){
                                $scope.activeTabIndex = 0;
                            });
                            $scope.selectTier($scope.tierLevelsForFees[0]);
                        }
                    }
                }).catch(function (error) {
                    $scope.loadingTierFees = false;
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
            var index = $scope.allTiers.findIndex(vm.findIndexOfTier,tierLevel);
            $scope.selectedTier = $scope.allTiers[index];
            if($scope.selectedTier){
                $scope.getTierFees();
            }
        };

        $scope.getTierFees = function(){
            if(vm.token) {
                $scope.loadingTierFees = true;
                $http.get(environmentConfig.API + '/admin/groups/' + vm.groupName + '/tiers/' + $scope.selectedTier.id + '/fees/',{
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingTierFees = false;
                    if (res.status === 200) {
                        res.data.data.forEach(function (element) {
                            element.currency = vm.returnCurrencyObj(element.currency);
                        });

                        $scope.tiersFeesList = res.data.data;
                    }
                }).catch(function (error) {
                    $scope.loadingTierFees = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.openAddGroupTierFeeModal = function (page, size) {
            vm.theAddFeeModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'AddGroupTierFeeModalCtrl',
                scope: $scope,
                resolve: {
                    selectedTier: function () {
                        return $scope.selectedTier;
                    }
                }
            });

            vm.theAddFeeModal.result.then(function(tierLevel){
                if(tierLevel){
                    $scope.getAllTiers(tierLevel);
                }
            }, function(){
            });
        };

        $scope.openEditGroupTierFeeModal = function (page, size,tierFee) {
            vm.theEditModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'EditGroupTierFeeModalCtrl',
                scope: $scope,
                resolve: {
                    tierFee: function () {
                        return tierFee;
                    },
                    selectedTier: function () {
                        return $scope.selectedTier;
                    }
                }
            });

            vm.theEditModal.result.then(function(tierLevel){
                if(tierLevel){
                    $scope.getAllTiers(tierLevel);
                }
            }, function(){
            });
        };

        $scope.deleteTierFeeConfirm = function (tierFee) {
            $ngConfirm({
                title: 'Delete tier fee',
                content: 'Are you sure you want to remove this tier fee?',
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
                            $scope.deleteTierFee(tierFee);
                        }
                    }
                }
            });
        };

        $scope.deleteTierFee = function (tierFee) {
            $scope.deletingTierFees = true;
            $http.delete(environmentConfig.API + '/admin/groups/' + vm.groupName + '/tiers/' + $scope.selectedTier.id + '/fees/' + tierFee.id + '/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.deletingTierFees = false;
                if (res.status === 200) {
                    toastr.success('Tier fee successfully deleted');
                    $scope.getAllTiers($scope.selectedTier.level);
                }
            }).catch(function (error) {
                $scope.deletingTierFees = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };



    }
})();
