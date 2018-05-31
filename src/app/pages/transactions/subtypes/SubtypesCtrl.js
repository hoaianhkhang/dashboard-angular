(function () {
    'use strict';

    angular.module('BlurAdmin.pages.transactions.subtypes')
        .controller('SubtypesCtrl', SubtypesCtrl);

    /** @ngInject */
    function SubtypesCtrl($scope,Rehive,$uibModal,localStorageManagement,$location,errorHandler) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        $scope.loadingSubtypes = true;
        vm.location = $location.path();
        vm.locationArray = vm.location.split('/');
        $scope.locationIndicator = vm.locationArray[vm.locationArray.length - 1];

        vm.getSubtypes = function () {
            if(vm.token) {
                $scope.loadingSubtypes = true;
                Rehive.admin.subtypes.get().then(function (res) {
                    $scope.loadingSubtypes = false;
                    $scope.subtypes = res;
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingSubtypes = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.getSubtypes();

        $scope.openAddSubtypeModal = function (page, size) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'AddSubtypeModalCtrl',
                scope: $scope
            });

            vm.theModal.result.then(function(subtype){
                if(subtype){
                    vm.getSubtypes();
                }
            }, function(){
            });
        };

        $scope.openEditSubtypeModal = function (page, size,subtype) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'EditSubtypeModalCtrl',
                scope: $scope,
                resolve: {
                    subtype: function () {
                        return subtype;
                    }
                }
            });

            vm.theModal.result.then(function(subtype){
                if(subtype){
                    vm.getSubtypes();
                }
            }, function(){
            });
        };

        $scope.openSubtypeModal = function (page, size,subtype) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'SubtypeModalCtrl',
                scope: $scope,
                resolve: {
                    subtype: function () {
                        return subtype;
                    }
                }
            });

            vm.theModal.result.then(function(subtype){
                if(subtype){
                    vm.getSubtypes();
                }
            }, function(){
            });
        };
    }
})();
