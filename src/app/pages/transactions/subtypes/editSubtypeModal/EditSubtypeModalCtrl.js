(function () {
    'use strict';

    angular.module('BlurAdmin.pages.transactions.subtypes')
        .controller('EditSubtypeModalCtrl', EditSubtypeModalCtrl);

    function EditSubtypeModalCtrl($scope,Rehive,$uibModalInstance,subtype,toastr,
                                  localStorageManagement,errorHandler) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        $scope.editingSubtype = false;
        $scope.editSubtype = {};
        vm.updatedSubtype = {};


        vm.getSubtype = function (subtype) {
            $scope.editingSubtype = true;
            Rehive.admin.subtypes.get({id: subtype.id}).then(function (res) {
                $scope.editingSubtype = false;
                $scope.editSubtype = res;
                $scope.$apply();
            }, function (error) {$scope.$apply();
                $scope.editingSubtype = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };
        vm.getSubtype(subtype);

        $scope.subtypeChanged = function(field){
            if(field == 'name'){
                $scope.editSubtype.name = $scope.editSubtype.name.toLowerCase();
            }

            vm.updatedSubtype[field] = $scope.editSubtype[field];
        };

        $scope.updateSubtype = function () {
            $scope.editingSubtype = true;
            Rehive.admin.subtypes.update($scope.editSubtype.id, vm.updatedSubtype).then(function (res) {
                $scope.editingSubtype = false;
                vm.updatedSubtype = {};
                toastr.success('You have successfully updated the subtype');
                $uibModalInstance.close(true);
                $scope.$apply();
            }, function (error) {
                $scope.editingSubtype = false;
                vm.updatedSubtype = {};
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();

            });
        };



    }
})();
