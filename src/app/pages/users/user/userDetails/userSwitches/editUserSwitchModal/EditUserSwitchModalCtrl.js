(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('EditUserSwitchModalCtrl', EditUserSwitchModalCtrl);

    function EditUserSwitchModalCtrl($scope,$uibModalInstance,userSwitches,toastr,$stateParams,sharedResources,
                                      $http,environmentConfig,cookieManagement,errorHandler) {

        var vm = this;
        vm.uuid = $stateParams.uuid;
        $scope.userSwitch = userSwitches;
        vm.updatedUserSwitch = {};
        $scope.editUserSwitch = {};
        $scope.userSwitchesOptions = ['Credit','Debit'];
        $scope.boolOptions = ['False','True'];
        vm.token = cookieManagement.getCookie('TOKEN');

        vm.getUserSwitch = function () {
            $scope.loadingUserSwitches = true;
            $http.get(environmentConfig.API + '/admin/users/' + vm.uuid + '/switches/' + $scope.userSwitch.id + '/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.loadingUserSwitches = false;
                if (res.status === 200) {
                    $scope.editUserSwitch = res.data.data;
                    $scope.editUserSwitch.tx_type == 'credit' ? $scope.editUserSwitch.tx_type = 'Credit' : $scope.editUserSwitch.tx_type = 'Debit';
                    $scope.editUserSwitch.enabled == true ? $scope.editUserSwitch.enabled = 'True' : $scope.editUserSwitch.enabled = 'False';
                    $scope.getSubtypesArray($scope.editUserSwitch,'editing');
                }
            }).catch(function (error) {
                $scope.loadingUserSwitches = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };
        vm.getUserSwitch();

        $scope.userSwitchChanged = function(field){
            vm.updatedUserSwitch[field] = $scope.editUserSwitch[field];
        };

        $scope.updateUserSwitch = function () {

            if(!$scope.editUserSwitch.subtype){
                vm.updatedUserSwitch.subtype = '';
            }

            vm.updatedUserSwitch.tx_type ? vm.updatedUserSwitch.tx_type = vm.updatedUserSwitch.tx_type.toLowerCase() : '';
            vm.updatedUserSwitch.enabled ? vm.updatedUserSwitch.enabled = vm.updatedUserSwitch.enabled == 'True' ? true: false : '';
            if(vm.token) {
                $scope.loadingUserSwitches = true;
                $http.patch(environmentConfig.API + '/admin/users/' + vm.uuid + '/switches/' + $scope.editUserSwitch.id + '/', vm.updatedUserSwitch, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingUserSwitches = false;
                    if (res.status === 200) {
                        vm.updatedUserSwitch = {};
                        toastr.success('Successfully updated the user switch');
                        $uibModalInstance.close(res.data);
                    }
                }).catch(function (error) {
                    vm.updatedUserSwitch = {};
                    $scope.loadingUserSwitches = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.getSubtypesArray = function(params,editing){
            $scope.loadingSubtypes = true;
            if(!editing){
                params.subtype = '';
            } else if(!params.subtype && editing){
                params.subtype = '';
            }
            sharedResources.getSubtypes().then(function (res) {
                res.data.data = res.data.data.filter(function (element) {
                    return element.tx_type == (params.tx_type).toLowerCase();
                });
                $scope.subtypeOptions = _.pluck(res.data.data,'name');
                $scope.subtypeOptions.unshift('');
                $scope.loadingSubtypes = false;
            });
        };



    }
})();
