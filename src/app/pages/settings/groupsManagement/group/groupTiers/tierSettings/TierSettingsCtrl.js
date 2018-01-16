(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groupTiers.tierSettings')
        .controller('TierSettingsCtrl', TierSettingsCtrl);

    /** @ngInject */
    function TierSettingsCtrl($scope,environmentConfig,$http,$stateParams,cookieManagement,errorHandler,$timeout,$location) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
        vm.groupName = $stateParams.groupName;
        $scope.activeTabIndex = 0;
        $scope.tierLevelsForSettings = [];
        $scope.tierSettingsObj = {};
        $scope.loadingTierSettings = true;

        $scope.getAllTiers = function(tierLevel){
            if(vm.token) {
                $scope.loadingTierSettings = true;
                $http.get(environmentConfig.API + '/admin/groups/' + vm.groupName + '/tiers/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingTierSettings = false;
                    if (res.status === 200) {
                        vm.unsortedTierLevelsArray = _.pluck(res.data.data ,'level');
                        vm.sortedTierLevelsArray = vm.unsortedTierLevelsArray.sort(function(a, b) {
                            return a - b;
                        });
                        $scope.tierLevelsForSettings = vm.sortedTierLevelsArray;
                        $scope.allTiers = res.data.data.sort(function(a, b) {
                            return parseFloat(a.level) - parseFloat(b.level);
                        });
                        if(tierLevel){
                            $scope.selectTier(tierLevel);
                        } else {
                            $timeout(function(){
                                $scope.activeTabIndex = 0;
                            });
                            $scope.selectTier($scope.tierLevelsForSettings[0]);
                        }
                    }
                }).catch(function (error) {
                    $scope.loadingTierSettings = false;
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
                vm.getTierSettings();
            }
        };

        vm.getTierSettings = function () {
            if(vm.token) {
                $scope.loadingTierSettings = true;
                $http.get(environmentConfig.API + '/admin/groups/' + vm.groupName + '/tiers/' + $scope.selectedTier.id + '/settings/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingTierSettings = false;
                    if (res.status === 200) {
                        $scope.tierSettingsObj = res.data.data;
                    }
                }).catch(function (error) {
                    $scope.loadingTierSettings = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.toggleTierSettings = function (tierSetting,type) {

            var updatedSetting = {};
            updatedSetting[type] = !tierSetting;

            if(vm.token) {
                $http.patch(environmentConfig.API + '/admin/groups/' + vm.groupName + '/tiers/' + $scope.selectedTier.id + '/settings/',updatedSetting, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $scope.tierSettingsObj = {};
                        $scope.tierSettingsObj = res.data.data;
                    }
                }).catch(function (error) {
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

    }
})();
