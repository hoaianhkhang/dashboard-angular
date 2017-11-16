(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('AddUserNumberModalCtrl', AddUserNumberModalCtrl);

    function AddUserNumberModalCtrl($scope,$stateParams,$uibModalInstance,user,toastr,$http,environmentConfig,cookieManagement,errorHandler) {

        var vm = this;
        $scope.user = user;
        vm.uuid = $stateParams.uuid;
        $scope.newUserNumber = {primary: 'False', verified: 'False'};
        $scope.booleanOptions = ['False','True'];
        vm.token = cookieManagement.getCookie('TOKEN');
        $scope.loadingUserNumbers = false;


        $scope.createUserNumber = function (newUserNumber) {
            $scope.loadingUserNumbers = true;
            newUserNumber.user = vm.uuid;
            newUserNumber.primary = newUserNumber.primary == 'True' ? true:false;
            newUserNumber.verified = newUserNumber.verified == 'True' ? true:false;
            $http.post(environmentConfig.API + '/admin/users/mobiles/',newUserNumber, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                if (res.status === 201) {
                    $scope.loadingUserNumbers = true;
                    $scope.newUserNumber = {primary: 'False', verified: 'False'};
                    toastr.success('Number successfully created');
                    $uibModalInstance.close(res.data);
                }
            }).catch(function (error) {
                $scope.newUserNumber = {primary: 'False', verified: 'False'};
                $scope.loadingUserNumbers = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

    }
})();
