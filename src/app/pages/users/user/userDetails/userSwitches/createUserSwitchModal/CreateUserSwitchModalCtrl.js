(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('CreateUserSwitchModalCtrl', CreateUserSwitchModalCtrl);

    function CreateUserSwitchModalCtrl($scope,$uibModalInstance,toastr,$stateParams,sharedResources,
                                       $http,environmentConfig,cookieManagement,errorHandler) {

        var vm = this;

        $scope.userSwitchParams = {
            tx_type: 'Credit',
            enabled: false,
            subtype: ''
        };
        vm.uuid = $stateParams.uuid;
        $scope.statusOptions = ['Pending', 'Incomplete', 'Declined', 'Verified'];
        $scope.userSwitchesOptions = ['Credit','Debit'];
        vm.token = cookieManagement.getCookie('TOKEN');

        $scope.addUserSwitch = function(userSwitchParams){
            userSwitchParams.tx_type ? userSwitchParams.tx_type = userSwitchParams.tx_type.toLowerCase() : '';
            if(vm.token) {
                $scope.loadingUserSwitches = true;
                $http.post(environmentConfig.API + '/admin/users/' + vm.uuid + '/switches/', userSwitchParams, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 201) {
                        $scope.addingUserSwitches = false;
                        toastr.success('Successfully created the user switch');
                        $scope.userSwitchParams = {
                            tx_type: 'Credit',
                            enabled: false,
                            subtype: ''
                        };
                        $uibModalInstance.close(res.data);
                    }
                }).catch(function (error) {
                    $scope.userSwitchParams = {
                        tx_type: 'Credit',
                        enabled: false,
                        subtype: ''
                    };
                    $scope.getSubtypesArray($scope.userSwitchParams);
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
        $scope.getSubtypesArray($scope.userSwitchParams);



    }
})();
