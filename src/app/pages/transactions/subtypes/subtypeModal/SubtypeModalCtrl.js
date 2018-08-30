(function () {
    'use strict';

    angular.module('BlurAdmin.pages.transactions.subtypes')
        .controller('SubtypeModalCtrl', SubtypeModalCtrl);

    function SubtypeModalCtrl($scope,Rehive,$uibModalInstance,subtype,
                              $ngConfirm,toastr,localStorageManagement,errorHandler) {

        var vm = this;
        $scope.subtype = subtype;
        vm.token = localStorageManagement.getValue('token');
        $scope.deletingSubtype = false;

        $scope.archiveSubtype = function () {
            $scope.deletingSubtype = true;
            Rehive.admin.subtypes.update($scope.subtype.id, {archived: true}).then(function (res) {
                toastr.success('You have successfully archived the subtype');
                $uibModalInstance.close(true);
                $scope.$apply();
            }, function (error) {
                $scope.deletingSubtype = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

        $scope.deleteSubtypePrompt = function () {
            if(!$scope.subtype.archived){
                toastr.error('Cannot delete an unarchived object');
                return;
            }

            $ngConfirm({
                title: 'Delete subtype',
                contentUrl: 'app/pages/transactions/subtypes/subtypeModal/deleteSubtypePrompt.html',
                animationBounce: 1,
                animationSpeed: 100,
                scope: $scope,
                buttons: {
                    close: {
                        text: "Cancel",
                        btnClass: 'btn-default dashboard-btn'
                    },
                    Add: {
                        text: "Delete permanently",
                        btnClass: 'btn-danger',
                        keys: ['enter'], // will trigger when enter is pressed
                        action: function(scope){
                            if(scope.deleteText != 'DELETE'){
                                toastr.error('DELETE text did not match');
                                return;
                            }
                            scope.deleteSubtype();
                        }
                    }
                }
            });
        };

        $scope.deleteSubtype = function () {
            $scope.deletingSubtype = true;
            Rehive.admin.subtypes.delete($scope.subtype.id).then(function (res) {
                $scope.deletingSubtype = false;
                toastr.success('You have successfully deleted the subtype');
                $uibModalInstance.close(true);
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
