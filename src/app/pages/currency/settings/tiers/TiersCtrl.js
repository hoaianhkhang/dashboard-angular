(function () {
    'use strict';

    angular.module('BlurAdmin.pages.currency.settings.tiers')
        .controller('TiersCtrl', TiersCtrl);

    function TiersCtrl($scope,$stateParams,$uibModal,$http,cookieManagement,environmentConfig,toastr,errorHandler,$window) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
        $scope.currencyCode = $stateParams.currencyCode;
        $scope.loadingTiers = true;
        $scope.newTier = {currency: $scope.currencyCode,level: 1};
        $scope.tierLevels = [1,2,3,4,5,6,7];
        vm.updatedTier = {};

          $scope.toggleTierEditView = function(tier){
              if(tier){
                  vm.getTier(tier)
              } else {
                  $scope.editTier = {};
                  vm.getTiers();
              }
              $scope.editingTiers = !$scope.editingTiers;
          };

        vm.getTier = function(tier){
            if(vm.token) {
                $scope.loadingTiers = true;
                $http.get(environmentConfig.API + '/admin/tiers/' + tier.id + '/' ,{
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingTiers = false;
                    if (res.status === 200) {
                        $scope.editTier = res.data.data;
                    }
                }).catch(function (error) {
                    $scope.loadingTiers = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };


      vm.getTiers = function(){
          if(vm.token) {
              $scope.loadingTiers = true;
              $http.get(environmentConfig.API + '/admin/tiers/?currency=' + $scope.currencyCode, {
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

      $scope.addTier = function(){
          if(vm.token) {
              $scope.loadingTiers = true;
              $http.post(environmentConfig.API + '/admin/tiers/', $scope.newTier ,{
                  headers: {
                      'Content-Type': 'application/json',
                      'Authorization': vm.token
                  }
              }).then(function (res) {
                $scope.loadingTiers = false;
                  if (res.status === 201) {
                    $scope.newTier = {currency: $scope.currencyCode,level: 1};
                    toastr.success('You have successfully added a tier');
                      vm.getTiers();
                  }
              }).catch(function (error) {
                  $scope.loadingTiers = false;
                  errorHandler.evaluateErrors(error.data);
                  errorHandler.handleErrors(error);
              });
          }
      };

      $scope.tierChanged = function(field){
          vm.updatedTier[field] = $scope.editTier[field];
      };

      $scope.updateTier = function(){
          if(vm.token) {
            $window.scrollTo(0, 0);
            $scope.editingTiers = !$scope.editingTiers;
            vm.updatedTier.level = $scope.editTier.level;
            $scope.loadingTiers = true;
              $http.patch(environmentConfig.API + '/admin/tiers/' + $scope.editTier.id + '/', vm.updatedTier, {
                  headers: {
                      'Content-Type': 'application/json',
                      'Authorization': vm.token
                  }
              }).then(function (res) {
                $scope.loadingTiers = false;
                  if (res.status === 200) {
                      vm.updatedTier = {};
                      $scope.newTier = {currency: $scope.currencyCode,level: 1};
                      toastr.success('You have successfully updated a tier');
                      vm.getTiers();
                  }
              }).catch(function (error) {
                  vm.updatedTier = {};
                  vm.getTiers();
                  errorHandler.evaluateErrors(error.data);
                  errorHandler.handleErrors(error);
              });
          }
      };

      vm.findIndexOfTier = function(element){
          return this.id == element.id;
      };

      $scope.openTierModal = function (page, size,tier) {
          vm.theModal = $uibModal.open({
              animation: true,
              templateUrl: page,
              size: size,
              controller: 'TierModalCtrl',
              scope: $scope,
              resolve: {
                  tier: function () {
                      return tier;
                  }
              }
          });

          vm.theModal.result.then(function(tier){
              var index = $scope.tiersList.findIndex(vm.findIndexOfTier,tier);
              $scope.tiersList.splice(index, 1);
          }, function(){
          });
      };
    }
})();
