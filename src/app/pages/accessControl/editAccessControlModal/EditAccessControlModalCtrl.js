(function () {
    'use strict';

    angular.module('BlurAdmin.pages.accessControl')
        .controller('EditAccessControlModalCtrl', EditAccessControlModalCtrl);

    /** @ngInject */
    function EditAccessControlModalCtrl($scope,$http,$uibModalInstance,toastr,environmentConfig,
                                        rule,localStorageManagement,errorHandler,serializeFiltersService) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.rule = rule;
        $scope.editingAccessControlRules = false;
        $scope.editAccessControlParams = {};
        vm.updatedAccessControlRule = {};

        $scope.getAccessControlRule = function () {
            $scope.editingAccessControlRules = true;
            $http.get(environmentConfig.API + '/admin/access-control-rules/' + rule.id + '/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.editingAccessControlRules = false;
                $scope.editAccessControlParams = res.data.data;
                if($scope.editAccessControlParams.user && $scope.editAccessControlParams.user.id){
                    $scope.editAccessControlParams.applyRuleTo = 'user';
                    $scope.editAccessControlParams.user = $scope.editAccessControlParams.user.email || $scope.editAccessControlParams.user.mobile || $scope.editAccessControlParams.user.id;
                } else if($scope.editAccessControlParams.group && $scope.editAccessControlParams.group.name){
                    $scope.editAccessControlParams.applyRuleTo = 'group';
                    $scope.editAccessControlParams.group = $scope.editAccessControlParams.group.name;
                } else {
                    $scope.editAccessControlParams.applyRuleTo = 'user';
                }
            }).catch(function (error) {
                $scope.editingAccessControlRules = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };
        $scope.getAccessControlRule();

        $scope.accessControlRuleChanged = function(field){
            vm.updatedAccessControlRule[field] = $scope.editAccessControlParams[field];
        };

        $scope.updateAccessControlRule = function () {
            $scope.editingAccessControlRules = true;

            var updatedRuleObj = {
                action: vm.updatedAccessControlRule.action ? vm.updatedAccessControlRule.action : null,
                value: vm.updatedAccessControlRule.value ? vm.updatedAccessControlRule.value : null,
                label: vm.updatedAccessControlRule.label ? vm.updatedAccessControlRule.label : null
            };

            if($scope.editAccessControlParams.applyRuleTo === 'user'){
                updatedRuleObj[$scope.editAccessControlParams.applyRuleTo] = vm.updatedAccessControlRule[$scope.editAccessControlParams.applyRuleTo];
                updatedRuleObj.group = ' ';
            } else if($scope.editAccessControlParams.applyRuleTo === 'group') {
                updatedRuleObj[$scope.editAccessControlParams.applyRuleTo] = vm.updatedAccessControlRule[$scope.editAccessControlParams.applyRuleTo];
                updatedRuleObj.user = ' ';
            }

            $http.patch(environmentConfig.API + '/admin/access-control-rules/' + rule.id + '/',serializeFiltersService.objectFilters(updatedRuleObj), {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                if(res.status === 200 || res.status === 201) {
                    $scope.editingAccessControlRules = false;
                    toastr.success('You have successfully updated the access control rule');
                    $uibModalInstance.close(true);
                }
            }).catch(function (error) {
                $scope.editingAccessControlRules = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });


        };

        // $scope.addAccessControlRules = function (accessControlParams) {
        //     $scope.editingAccessControlRules = true;
        //
        //     var newAccessControlRule = {
        //         type: accessControlParams.type,
        //         action: accessControlParams.action,
        //         value: accessControlParams.value,
        //         label: accessControlParams.label
        //     };
        //
        //     newAccessControlRule[accessControlParams.applyRuleTo] = accessControlParams[accessControlParams.applyRuleTo];
        //
        //     $http.post(environmentConfig.API + '/admin/access-control-rules/',newAccessControlRule, {
        //         headers: {
        //             'Content-Type': 'application/json',
        //             'Authorization': vm.token
        //         }
        //     }).then(function (res) {
        //         $scope.editingAccessControlRules = false;
        //         if(res.status === 200 || res.status === 201) {
        //             toastr.success('You have successfully added the access control rule');
        //             $uibModalInstance.close(true);
        //         }
        //     }).catch(function (error) {
        //         $scope.editingAccessControlRules = false;
        //         errorHandler.evaluateErrors(error.data);
        //         errorHandler.handleErrors(error);
        //     });
        //
        // };

    }
})();
