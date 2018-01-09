(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groupTiers.list')
        .controller('TierModalCtrl', TierModalCtrl);

    function TierModalCtrl($scope,tier,groupName,$uibModalInstance,toastr,$http,environmentConfig,cookieManagement,errorHandler) {

        var vm = this;

        $scope.tier = tier;
        vm.token = cookieManagement.getCookie('TOKEN');
        vm.groupName = groupName;
        $scope.deletingTier = false;

        $scope.deleteTier = function(tier){
            if(vm.token) {
                $scope.deletingTier = true;
                $http.delete(environmentConfig.API + '/admin/groups/' + vm.groupName + '/tiers/' + $scope.tier.id + '/' ,{
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                  $scope.deletingTier = false;
                  if (res.status === 200) {
                      toastr.success('Tier successfully deleted');
                      $uibModalInstance.close($scope.tier);
                  }
                }).catch(function (error) {
                    $scope.deletingTier = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };


    }
})();
