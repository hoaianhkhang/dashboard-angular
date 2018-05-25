(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groups.groupManagementTiers.list')
        .controller('GroupTiersCtrl', GroupTiersCtrl);

    function GroupTiersCtrl($scope,$stateParams,$uibModal,localStorageManagement,
                            Rehive,toastr,errorHandler,$ngConfirm) {

    var vm = this;
    vm.token = localStorageManagement.getValue('TOKEN');
    vm.groupName = $stateParams.groupName;
    $scope.loadingTiers = true;

      vm.getTiers = function(){
          if(vm.token) {
              $scope.loadingTiers = true;
              Rehive.admin.groups.tiers.get(vm.groupName).then(function (res) {
                  $scope.loadingTiers = false;
                  $scope.tiersList = res;
                  $scope.$apply();
              }, function (error) {
                  $scope.loadingTiers = false;
                  errorHandler.evaluateErrors(error);
                  errorHandler.handleErrors(error);
                  $scope.$apply();
              });
          }
      };
      vm.getTiers();

        $scope.deleteGroupTierConfirm = function (tier) {
            $ngConfirm({
                title: 'Delete tier',
                content: 'Are you sure you want to remove this tier?',
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
                            $scope.deleteGroupTier(tier);
                        }
                    }
                }
            });
        };

        $scope.deleteGroupTier = function (tier) {
            $scope.loadingTiers = true;
            Rehive.admin.groups.tiers.delete(vm.groupName,tier.id).then(function (res) {
                toastr.success('Tier successfully deleted');
                vm.getTiers();
            }, function (error) {
                $scope.loadingTiers = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

      $scope.openEditTierModal = function (page, size,tier) {
          vm.theModal = $uibModal.open({
              animation: true,
              templateUrl: page,
              size: size,
              controller: 'editGroupTierModalCtrl',
              scope: $scope,
              resolve: {
                  tier: function () {
                      return tier;
                  }
              }
          });

          vm.theModal.result.then(function(tier){
              if(tier){
                  vm.getTiers();
              }
          }, function(){
          });
      };

        $scope.openCreateGroupTierModal = function (page, size) {
            vm.theAddModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'AddGroupTierModalCtrl',
                scope: $scope
            });

            vm.theAddModal.result.then(function(tier){
                if(tier){
                    vm.getTiers();
                }
            }, function(){
            });
        };
    }
})();
