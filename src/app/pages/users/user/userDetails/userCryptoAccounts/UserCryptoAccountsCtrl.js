(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('UserCryptoAccountsCtrl', UserCryptoAccountsCtrl);

    /** @ngInject */
    function UserCryptoAccountsCtrl($scope,environmentConfig,$stateParams,$http,
                                    localStorageManagement,errorHandler,$uibModal) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.uuid = $stateParams.uuid;
        $scope.userCryptoAccountsList = [];
        $scope.loadingUserCryptoAccounts = true;
        $scope.userCryptoTypeOptions = ['Bitcoin','Ethereum','Other'];

        vm.getUserCryptoAccounts = function(){
            if(vm.token) {
                $scope.loadingUserCryptoAccounts = true;
                $http.get(environmentConfig.API + '/admin/users/crypto-accounts/?user=' + vm.uuid, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingUserCryptoAccounts = false;
                    if (res.status === 200) {
                        $scope.userCryptoAccountsList = res.data.data.results;
                    }
                }).catch(function (error) {
                    $scope.loadingUserCryptoAccounts = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        vm.getUserCryptoAccounts();

        $scope.openEditUserCryptoAccountsModal = function (page, size,userCryptoAccount) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'EditUserCryptoAccountsModalCtrl',
                scope: $scope,
                resolve: {
                    userCryptoAccount: function () {
                        return userCryptoAccount;
                    }
                }
            });

            vm.theModal.result.then(function(userCryptoAccount){
                if(userCryptoAccount){
                    vm.getUserCryptoAccounts();
                }
            }, function(){
            });
        };

        $scope.openAddUserCryptoAccountsModal = function (page, size) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'AddUserCryptoAccountsModalCtrl',
                scope: $scope
            });

            vm.theModal.result.then(function(userCryptoAccount){
                if(userCryptoAccount){
                    vm.getUserCryptoAccounts();
                }
            }, function(){
            });
        };

        vm.findIndexOfUserCryptoAccount = function (element) {
            return this.id == element.id;
        };

        $scope.openUserCryptoAccountsModal = function (page, size,userCryptoAccount) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'UserCryptoAccountsModalCtrl',
                scope: $scope,
                resolve: {
                    userCryptoAccount: function () {
                        return userCryptoAccount;
                    },
                    uuid: function () {
                        return vm.uuid;
                    }
                }
            });

            vm.theModal.result.then(function(userCryptoAccount){
                if(userCryptoAccount){
                    var index = $scope.userCryptoAccountsList.findIndex(vm.findIndexOfUserCryptoAccount,userCryptoAccount);
                    $scope.userCryptoAccountsList.splice(index, 1);
                    vm.getUserCryptoAccounts();
                }
            }, function(){
            });
        };


    }
})();
