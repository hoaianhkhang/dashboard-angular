(function () {
    'use strict';

    angular.module('BlurAdmin.pages.accountInfo')
        .controller('AccountInfoCtrl', AccountInfoCtrl);

    /** @ngInject */
    function AccountInfoCtrl($scope,environmentConfig,$http,localStorageManagement,errorHandler,toastr,$location) {
        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        $scope.loadingAccountInfo = true;
        $scope.showAdminEmails = false;
        vm.updatedAdministrator = {};

        $scope.accountInfoChanged = function(field){
            vm.updatedAdministrator[field] = $scope.administrator[field];
        };

        vm.getAdminAccountInfo = function () {
            if(vm.token) {
                $http.get(environmentConfig.API + '/user/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingAccountInfo = false;
                    if (res.status === 200) {
                        $scope.administrator = res.data.data;
                    }
                }).catch(function (error) {
                    $scope.loadingAccountInfo = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        vm.getAdminAccountInfo();

        $scope.updateAdministratorAccount = function(){
            $scope.loadingAccountInfo = true;
            $http.patch(environmentConfig.API + '/user/', vm.updatedAdministrator ,{
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.loadingAccountInfo = false;
                if (res.status === 200) {
                    $scope.administrator = res.data.data;
                    toastr.success('You have successfully updated the administrator info');
                }
                vm.updatedAdministrator = {};
            }).catch(function (error) {
                vm.updatedAdministrator = {};
                $scope.loadingAccountInfo = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        $scope.viewAllEmails = function (){
            $location.path('/admin/emails');
        };

        $scope.changePassword = function(){
            $location.path('/password/change');
        };

    }
})();
