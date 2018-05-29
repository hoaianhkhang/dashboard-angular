(function () {
    'use strict';

    angular.module('BlurAdmin.pages.settings.accountInfo')
        .controller('AccountInfoCtrl', AccountInfoCtrl);

    /** @ngInject */
    function AccountInfoCtrl($scope,Rehive,localStorageManagement,errorHandler,toastr,$location) {
        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        $scope.loadingAccountInfo = true;
        $scope.showAdminEmails = false;
        vm.updatedAdministrator = {};

        $scope.accountInfoChanged = function(field){
            vm.updatedAdministrator[field] = $scope.administrator[field];
        };

        vm.getAdminAccountInfo = function () {
            if(vm.token) {
                Rehive.user.get().then(function(user){
                    $scope.loadingAccountInfo = false;
                    $scope.administrator = user;
                    $scope.$apply();
                },function(error){
                    $scope.loadingAccountInfo = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.getAdminAccountInfo();

        $scope.updateAdministratorAccount = function(){
            $scope.loadingAccountInfo = true;
            Rehive.user.update(vm.updatedAdministrator).then(function (user) {
                $scope.loadingAccountInfo = false;
                $scope.administrator = user;
                toastr.success('You have successfully updated the administrator info');
                vm.updatedAdministrator = {};
                $scope.$apply();
            }, function (error) {
                vm.updatedAdministrator = {};
                $scope.loadingAccountInfo = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

        $scope.viewAllEmails = function (){
            $location.path('/settings/admin/emails');
        };

    }
})();
