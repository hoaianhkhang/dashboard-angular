(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('EditUserNumberModalCtrl', EditUserNumberModalCtrl);

    function EditUserNumberModalCtrl($scope,$stateParams,$uibModalInstance,user,number,toastr,$http,environmentConfig,cookieManagement,errorHandler) {

        var vm = this;
        $scope.user = user;
        $scope.number = number;
        vm.uuid = $stateParams.uuid;
        $scope.editUserNumberObj = {};
        vm.updatedUserNumber = {};
        $scope.booleanOptions = ['False','True'];
        vm.token = cookieManagement.getCookie('TOKEN');
        $scope.loadingUserNumbers = false;


        vm.getUserNumber =  function () {
            if(vm.token) {
                $scope.loadingUserNumbers = true;
                $http.get(environmentConfig.API + '/admin/users/mobiles/' + $scope.number.id + '/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingUserNumbers = false;
                    if (res.status === 200) {
                        $scope.editUserNumberObj = res.data.data;
                        $scope.editUserNumberObj.primary = $scope.editUserNumberObj.primary ? 'True' : 'False';
                        $scope.editUserNumberObj.verified = $scope.editUserNumberObj.verified ? 'True' : 'False';
                    }
                }).catch(function (error) {
                    $scope.loadingUserNumbers = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        vm.getUserNumber();

        $scope.editUserNumber =  function (editUserNumberObj) {

            if(editUserNumberObj.primary){
                editUserNumberObj.primary = editUserNumberObj.primary == 'True' ? true : false;
            }

            if(vm.token) {
                $scope.loadingUserNumbers = true;
                $http.patch(environmentConfig.API + '/admin/users/mobiles/' + $scope.number.id + '/',editUserNumberObj, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingUserNumbers = false;
                    if (res.status === 200) {
                        toastr.success('Number successfully updated');
                        $uibModalInstance.close(res.data);
                    }
                }).catch(function (error) {
                    $scope.loadingUserNumbers = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

    }
})();
