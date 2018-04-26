(function () {
    'use strict';

    angular.module('BlurAdmin.pages.transactions.subtypes')
        .controller('AddSubtypeModalCtrl', AddSubtypeModalCtrl);

    function AddSubtypeModalCtrl($scope,$uibModalInstance,toastr,$http,$filter,environmentConfig,localStorageManagement,errorHandler) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        $scope.addingSubtype = false;
        $scope.newSubtype = {tx_type: 'credit'};

        $scope.subtypeNameChanged = function (subtype) {
            if(subtype.name){
                subtype.name = subtype.name.toLowerCase();
                subtype.label = $filter('capitalizeWord')(subtype.name).replace(/_/g, " ").replace(/-/g, " ");
            } else {
                subtype.label = '';
            }
        };

        $scope.addSubtype = function(){
            $scope.addingSubtype = true;
            $http.post(environmentConfig.API + '/admin/subtypes/', $scope.newSubtype, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.addingSubtype = false;
                if (res.status === 201) {
                    toastr.success('You have successfully added a new subtype');
                    $uibModalInstance.close(true);
                }
            }).catch(function (error) {
                $scope.addingSubtype = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };



    }
})();
