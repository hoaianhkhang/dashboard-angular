(function () {
    'use strict';

    angular.module('BlurAdmin.pages.transactions.subtypes')
        .controller('SubtypeModalCtrl', SubtypeModalCtrl);

    function SubtypeModalCtrl($scope,Rehive,$uibModalInstance,subtype,toastr,localStorageManagement,errorHandler) {

        var vm = this;

        $scope.subtype = subtype;
        vm.token = localStorageManagement.getValue('TOKEN');
        $scope.deletingSubtype = false;

        $scope.deleteSubtype = function () {
            $scope.deletingSubtype = true;
            Rehive.admin.subtypes.delete($scope.subtype.id).then(function (res) {
                $scope.deletingSubtype = false;
                toastr.success('You have successfully deleted the subtype');
                $uibModalInstance.close($scope.subtype);
                $scope.$apply();
            }, function (error) {
                $scope.deletingSubtype = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };



    }
})();
