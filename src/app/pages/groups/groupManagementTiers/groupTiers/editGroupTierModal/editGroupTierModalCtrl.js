(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groups.groupManagementTiers.list')
        .controller('editGroupTierModalCtrl', editGroupTierModalCtrl);

    function editGroupTierModalCtrl($scope,tier,$uibModalInstance,toastr,$http,environmentConfig,cookieManagement,errorHandler) {

        var vm = this;

        $scope.editTier = tier;
        vm.token = cookieManagement.getCookie('TOKEN');
        vm.updatedTier = {};
        $scope.editingTiers = false;

        $scope.tierChanged = function(field){
            vm.updatedTier[field] = $scope.editTier[field];
        };

        $scope.updateGroupTier = function(){
            if(vm.token) {
                $scope.editingTiers = true;
                $http.patch(environmentConfig.API + '/admin/groups/' + vm.groupName + '/tiers/' + $scope.editTier.id + '/', vm.updatedTier, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                  $scope.loadingTiers = false;
                    if (res.status === 200) {
                        $scope.editingTiers = false;
                        vm.updatedTier = {};
                        toastr.success('You have successfully updated a tier');
                        $uibModalInstance.close(true);
                    }
                }).catch(function (error) {
                    $scope.editingTiers = false;
                    vm.updatedTier = {};
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };


    }
})();
