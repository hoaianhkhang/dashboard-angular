(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groups.groupManagementTiers.list')
        .controller('GroupTiersCtrl', GroupTiersCtrl);

    function GroupTiersCtrl($scope,$stateParams,$uibModal,$http,localStorageManagement,environmentConfig,toastr,errorHandler,$ngConfirm) {

    var vm = this;
    vm.token = localStorageManagement.getValue('TOKEN');
    vm.groupName = $stateParams.groupName;
    $scope.loadingTiers = true;

      vm.getTiers = function(){
          if(vm.token) {
              $scope.loadingTiers = true;
              $http.get(environmentConfig.API + '/admin/groups/' + vm.groupName + '/tiers/', {
                  headers: {
                      'Content-Type': 'application/json',
                      'Authorization': vm.token
                  }
              }).then(function (res) {
                $scope.loadingTiers = false;
                  if (res.status === 200) {
                    $scope.tiersList = res.data.data;
                  }
              }).catch(function (error) {
                  $scope.loadingTiers = false;
                  errorHandler.evaluateErrors(error.data);
                  errorHandler.handleErrors(error);
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
            $http.delete(environmentConfig.API + '/admin/groups/' + vm.groupName + '/tiers/' + tier.id + '/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                if (res.status === 200) {
                    toastr.success('Tier successfully deleted');
                    vm.getTiers();
                }
            }).catch(function (error) {
                $scope.loadingTiers = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
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
