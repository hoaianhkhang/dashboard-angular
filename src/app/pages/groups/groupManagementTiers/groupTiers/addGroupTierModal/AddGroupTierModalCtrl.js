(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groups.groupManagementTiers.list')
        .controller('AddGroupTierModalCtrl', AddGroupTierModalCtrl);

    function AddGroupTierModalCtrl($scope,$stateParams,$uibModalInstance,toastr,$http,environmentConfig,localStorageManagement,errorHandler) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.groupName = $stateParams.groupName;
        $scope.addingTiers = false;
        $scope.tierLevels = [1,2,3,4,5,6,7];
        $scope.newTier = {level: 1};

        $scope.addGroupTier = function(){
            if(vm.token) {
                $scope.addingTiers = true;
                $http.post(environmentConfig.API + '/admin/groups/' + vm.groupName + '/tiers/', $scope.newTier ,{
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.addingTiers = false;
                    if (res.status === 201) {
                        $scope.newTier = {currency: $scope.currencyCode,level: 1};
                        toastr.success('You have successfully added a tier');
                        $uibModalInstance.close(true);
                    }
                }).catch(function (error) {
                    $scope.addingTiers = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };


    }
})();
