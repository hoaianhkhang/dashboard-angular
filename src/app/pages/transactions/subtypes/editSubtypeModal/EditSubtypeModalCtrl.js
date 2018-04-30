(function () {
    'use strict';

    angular.module('BlurAdmin.pages.transactions.subtypes')
        .controller('EditSubtypeModalCtrl', EditSubtypeModalCtrl);

    function EditSubtypeModalCtrl($scope,$uibModalInstance,subtype,toastr,$http,environmentConfig,localStorageManagement,errorHandler) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        $scope.editingSubtype = false;
        $scope.editSubtype = {};
        vm.updatedSubtype = {};


        vm.getSubtype = function (subtype) {
            $scope.editingSubtype = true;
            $http.get(environmentConfig.API + '/admin/subtypes/' + subtype.id + '/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.editingSubtype = false;
                if (res.status === 200) {
                    $scope.editSubtype = res.data.data;
                }
            }).catch(function (error) {
                $scope.editingSubtype = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
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
            $http.patch(environmentConfig.API + '/admin/subtypes/'+ $scope.editSubtype.id + '/', vm.updatedSubtype, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.editingSubtype = false;
                if (res.status === 200) {
                    vm.updatedSubtype = {};
                    toastr.success('You have successfully updated the subtype');
                    $uibModalInstance.close(true);
                }
            }).catch(function (error) {
                $scope.editingSubtype = false;
                vm.updatedSubtype = {};
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };



    }
})();
