(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groups.groupManagementTiers.list')
        .controller('AddGroupTierModalCtrl', AddGroupTierModalCtrl);

    function AddGroupTierModalCtrl($scope,$stateParams,$uibModalInstance,toastr,$http,environmentConfig,cookieManagement,errorHandler) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
        vm.groupName = $stateParams.groupName;
        $scope.tierLevels = [1,2,3,4,5,6,7];
        $scope.newTier = {level: 1};

        $scope.addGroupTier = function(){
            if(vm.token) {
                $scope.loadingTiers = true;
                $http.post(environmentConfig.API + '/admin/groups/' + vm.groupName + '/tiers/', $scope.newTier ,{
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingTiers = false;
                    if (res.status === 201) {
                        $scope.newTier = {currency: $scope.currencyCode,level: 1};
                        toastr.success('You have successfully added a tier');
                        $uibModalInstance.close(true);
                    }
                }).catch(function (error) {
                    $scope.loadingTiers = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };


    }
})();
