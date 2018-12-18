(function () {
    'use strict';

    angular.module('BlurAdmin.pages.accessControl')
        .controller('DeleteAccessControlModalCtrl', DeleteAccessControlModalCtrl);

    function DeleteAccessControlModalCtrl($scope,Rehive,$uibModalInstance,rule,$http,
                                          environmentConfig,toastr,localStorageManagement,errorHandler) {

        var vm = this;

        $scope.rule = rule;
        $scope.deletingAccessControlRule = false;
        vm.token = localStorageManagement.getValue('TOKEN');

        $scope.deleteAccessControlRule = function () {
            $scope.deletingAccessControlRule = true;
            $http.delete(environmentConfig.API + '/admin/access-control-rules/' + rule.id + '/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.deletingAccessControlRule = false;
                if(res.status === 200) {
                    toastr.success('You have successfully deleted the access control rule');
                    $uibModalInstance.close(true);
                }
            }).catch(function (error) {
                $scope.deletingAccessControlRule = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };



    }
})();
