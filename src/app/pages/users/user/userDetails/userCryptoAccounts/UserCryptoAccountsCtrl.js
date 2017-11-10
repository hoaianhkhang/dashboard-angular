(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('UserCryptoAccountsCtrl', UserCryptoAccountsCtrl);

    /** @ngInject */
    function UserCryptoAccountsCtrl($scope,environmentConfig,$stateParams,$http,
                              $filter,cookieManagement,errorHandler,toastr,$uibModal) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
        vm.uuid = $stateParams.uuid;
        vm.updatedUserCryptoAccount = {};
        $scope.userCryptoAccountsList = [];
        $scope.loadingUserCryptoAccounts = true;
        $scope.addingUserCryptoAccounts = false;
        $scope.editingUserCryptoAccounts = false;
        $scope.userCryptoAccountParams = {
            crypto_type: 'Bitcoin',
            user: vm.uuid,
            address: '',
            metadata: '',
            status: 'Pending'
        };
        $scope.editUserCryptoAccountParams = {};
        vm.updatedUserCryptoAccount = {};
        $scope.userCryptoTypeOptions = ['Bitcoin','Ethereum','Other'];
        $scope.statusOptions = ['Pending', 'Incomplete', 'Declined', 'Verified'];

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

        $scope.toggleAddUserCryptoAccountsView = function () {
            $scope.addingUserCryptoAccounts = !$scope.addingUserCryptoAccounts;
        };

        $scope.addUserCryptoAccount = function(userCryptoAccountParams){
            if(vm.token) {
                $scope.loadingUserCryptoAccounts = true;
                userCryptoAccountParams.crypto_type = userCryptoAccountParams.crypto_type.toLowerCase();
                userCryptoAccountParams.status = userCryptoAccountParams.status.toLowerCase();
                $http.post(environmentConfig.API + '/admin/users/crypto-accounts/',userCryptoAccountParams, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 201) {
                        toastr.success('Crypto account successfully added');
                        $scope.userCryptoAccountParams = {
                            crypto_type: 'Bitcoin',
                            user: vm.uuid,
                            address: '',
                            metadata: '',
                            status: 'Pending'
                        };
                        $scope.toggleAddUserCryptoAccountsView();
                        vm.getUserCryptoAccounts();
                    }
                }).catch(function (error) {
                    $scope.userCryptoAccountParams = {
                        user: vm.uuid,
                        address: '',
                        metadata: '',
                        status: 'Pending'
                    };
                    $scope.loadingUserCryptoAccounts = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.toggleUserCryptoAccountsEditView = function (cryptoAccount) {
            if(cryptoAccount){
                $scope.editingUserCryptoAccounts = !$scope.editingUserCryptoAccounts;
                vm.getUserCryptoAccount(cryptoAccount);
            } else {
                $scope.editingUserCryptoAccounts = !$scope.editingUserCryptoAccounts;
                $scope.editUserCryptoAccountParams = {};
                vm.getUserCryptoAccounts();
            }
        };

        vm.getUserCryptoAccount =  function (cryptoAccount) {
            if(vm.token) {
                $scope.loadingUserCryptoAccounts = true;
                $http.get(environmentConfig.API + '/admin/users/crypto-accounts/' + cryptoAccount.id + '/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingUserCryptoAccounts = false;
                    if (res.status === 200) {
                        $scope.editUserCryptoAccountParams = res.data.data;
                        if(typeof $scope.editUserCryptoAccountParams.metadata == 'object'){
                            if(Object.keys($scope.editUserCryptoAccountParams.metadata).length == 0){
                                $scope.editUserCryptoAccountParams.metadata = '';
                            } else {
                                $scope.editUserCryptoAccountParams.metadata = JSON.stringify($scope.editUserCryptoAccountParams.metadata);
                            }
                        }
                        $scope.editUserCryptoAccountParams.status = $filter('capitalizeWord')($scope.editUserCryptoAccountParams.status);
                        $scope.editUserCryptoAccountParams.crypto_type = $filter('capitalizeWord')($scope.editUserCryptoAccountParams.crypto_type);
                    }
                }).catch(function (error) {
                    $scope.loadingUserCryptoAccounts = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.userCryptoAccountChanged =  function (field) {
            vm.updatedUserCryptoAccount[field] = $scope.editUserCryptoAccountParams[field];
        };

        $scope.editUserCryptoAccount =  function () {
            if(vm.updatedUserCryptoAccount.status){
                vm.updatedUserCryptoAccount.status = vm.updatedUserCryptoAccount.status.toLowerCase();
            }

            if(vm.updatedUserCryptoAccount.crypto_type){
                vm.updatedUserCryptoAccount.crypto_type = vm.updatedUserCryptoAccount.crypto_type.toLowerCase();
            }
            if(vm.token) {
                $scope.loadingUserCryptoAccounts = true;
                $http.patch(environmentConfig.API + '/admin/users/crypto-accounts/' + $scope.editUserCryptoAccountParams.id + '/',vm.updatedUserCryptoAccount, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingUserCryptoAccounts = false;
                    if (res.status === 200) {
                        toastr.success('Crypto account successfully updated');
                        $scope.editingUserCryptoAccounts = !$scope.editingUserCryptoAccounts;
                        vm.getUserCryptoAccounts();
                    }
                }).catch(function (error) {
                    vm.getUserCryptoAccount($scope.editUserCryptoAccountParams);
                    $scope.loadingUserCryptoAccounts = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
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
