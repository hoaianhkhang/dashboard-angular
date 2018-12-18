(function () {
    'use strict';

    angular.module('BlurAdmin.pages.accessControl')
        .controller('AddAccessControlModalCtrl', AddAccessControlModalCtrl);

    /** @ngInject */
    function AddAccessControlModalCtrl($scope,$http,$uibModalInstance,toastr,environmentConfig,
                                       Rehive,localStorageManagement,errorHandler) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        $scope.addingAccessControlRules = false;
        $scope.accessControlParams = {
            type: 'ip',
            action: 'allow',
            applyRuleTo: 'user'
        };

        $scope.addAccessControlRules = function (accessControlParams) {
            $scope.addingAccessControlRules = true;

            var newAccessControlRule = {
                type: accessControlParams.type,
                action: accessControlParams.action,
                value: accessControlParams.value,
                label: accessControlParams.label
            };

            newAccessControlRule[accessControlParams.applyRuleTo] = accessControlParams[accessControlParams.applyRuleTo];

            $http.post(environmentConfig.API + '/admin/access-control-rules/',newAccessControlRule, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.loadingAccessControl = false;
                if(res.status === 200 || res.status === 201) {
                    toastr.success('You have successfully added the access control rule');
                    $uibModalInstance.close(true);
                }
            }).catch(function (error) {
                $scope.loadingAccessControl = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });

        };

    }
})();
