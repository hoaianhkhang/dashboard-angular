(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groups.groupAccountConfigurations')
        .controller('DeleteGroupAccountConfigModalCtrl', DeleteGroupAccountConfigModalCtrl);

    function DeleteGroupAccountConfigModalCtrl($scope,$uibModalInstance,$ngConfirm,toastr,$stateParams,$filter,
                                            Rehive,localStorageManagement,errorHandler,$timeout) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        vm.groupName = $stateParams.groupName;
        $scope.deletingAccountConfig = false;

        $scope.deleteAccountConfigConfirm = function (accountConfiguration) {
            $ngConfirm({
                title: 'Delete account configuration',
                content: 'Are you sure you want to remove this account configuration?',
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
                            $scope.deleteAccountConfig(accountConfiguration);
                        }
                    }
                }
            });
        };

        $scope.deleteAccountConfig = function (accountConfiguration) {
            $scope.loadingGroupAccountConfigurations = true;
            Rehive.admin.groups.accountConfigurations.delete(vm.groupName,accountConfiguration.name).then(function (res) {
                toastr.success('Account configuration successfully deleted');
                $scope.getGroupAccountConfigurations();
                $scope.$apply();
            }, function (error) {
                $scope.loadingGroupAccountConfigurations = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

    }
})();
