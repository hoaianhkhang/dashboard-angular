(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user.accounts')
        .controller('UserAccountsListCtrl', UserAccountsListCtrl);

    /** @ngInject */
    function UserAccountsListCtrl($scope,environmentConfig,$stateParams,$rootScope,
                              $http,cookieManagement,errorHandler,$uibModal) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
        $rootScope.shouldBeBlue = 'Users';
        vm.uuid = $stateParams.uuid;
        $scope.loadingUserAccountsList = true;

        vm.getUserAccountsList = function(){
            if(vm.token) {
                $scope.loadingUserAccountsList = true;
                $http.get(environmentConfig.API + '/admin/accounts/?user=' + vm.uuid, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingUserAccountsList = false;
                    if (res.status === 200) {
                        $scope.accounts = res.data.data.results;
                    }
                }).catch(function (error) {
                    $scope.loadingUserAccountsList = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        vm.getUserAccountsList();

        $scope.openAddUserAccountsListModal = function (page, size) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'AddUserAccountsListModalCtrl',
                scope: $scope
            });

            vm.theModal.result.then(function(userAccountsList){
                if(userAccountsList){
                    vm.getUserAccountsList();
                }
            }, function(){
            });
        };

        $scope.openEditUserAccountsListModal = function (page, size,account) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'EditUserAccountModalCtrl',
                scope: $scope,
                resolve: {
                    account: function () {
                        return account;
                    }
                }
            });

            vm.theModal.result.then(function(userAccountsList){
                if(userAccountsList){
                    vm.getUserAccountsList();
                }
            }, function(){
            });
        };


    }
})();
