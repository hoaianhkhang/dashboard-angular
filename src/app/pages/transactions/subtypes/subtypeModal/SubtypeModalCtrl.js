(function () {
    'use strict';

    angular.module('BlurAdmin.pages.transactions.subtypes')
        .controller('SubtypeModalCtrl', SubtypeModalCtrl);

    function SubtypeModalCtrl($scope,$uibModalInstance,subtype,toastr,$http,environmentConfig,localStorageManagement,errorHandler) {

        var vm = this;

        $scope.subtype = subtype;
        vm.token = localStorageManagement.getValue('TOKEN');
        $scope.deletingSubtype = false;

        $scope.deleteSubtype = function () {
            $scope.deletingSubtype = true;
            $http.delete(environmentConfig.API + '/admin/subtypes/' + $scope.subtype.id + '/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.deletingSubtype = false;
                if (res.status === 200) {
                  toastr.success('You have successfully deleted the subtype');
                  $uibModalInstance.close($scope.subtype);
                }
            }).catch(function (error) {
                $scope.deletingSubtype = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };



    }
})();
