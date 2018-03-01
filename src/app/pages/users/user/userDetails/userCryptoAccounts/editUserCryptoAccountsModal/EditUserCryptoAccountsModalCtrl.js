(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('EditUserCryptoAccountsModalCtrl', EditUserCryptoAccountsModalCtrl);

    function EditUserCryptoAccountsModalCtrl($scope,$uibModalInstance,userCryptoAccount,toastr,$stateParams,$filter,
                                      $http,environmentConfig,cookieManagement,errorHandler) {

        var vm = this;
        vm.uuid = $stateParams.uuid;
        $scope.cryptoAccount = userCryptoAccount;
        $scope.editUserCryptoAccountParams = {};
        vm.updatedUserCryptoAccount = {};
        $scope.loadingUserCryptoAccounts = true;
        $scope.cryptoStatusOptions = ['Pending', 'Incomplete', 'Declined', 'Obsolete', 'Verified'];
        vm.token = cookieManagement.getCookie('TOKEN');

        vm.getUserCryptoAccount =  function () {
            if(vm.token) {
                $scope.loadingUserCryptoAccounts = true;
                $http.get(environmentConfig.API + '/admin/users/crypto-accounts/' + $scope.cryptoAccount.id + '/', {
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
        vm.getUserCryptoAccount();

        vm.isJson = function (str) {
            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }
            return true;
        };

        $scope.userCryptoAccountChanged =  function (field) {
            vm.updatedUserCryptoAccount[field] = $scope.editUserCryptoAccountParams[field];
        };

        $scope.editUserCryptoAccount =  function () {

            if($scope.editUserCryptoAccountParams.metadata){
                if(vm.isJson($scope.editUserCryptoAccountParams.metadata)){
                    vm.updatedUserCryptoAccount.metadata =  JSON.parse($scope.editUserCryptoAccountParams.metadata);
                } else {
                    toastr.error('Incorrect metadata format');
                    return false;
                }
            } else {
                vm.updatedUserCryptoAccount.metadata = {};
            }

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
                        $uibModalInstance.close(res.data);
                    }
                }).catch(function (error) {
                    vm.getUserCryptoAccount($scope.editUserCryptoAccountParams);
                    $scope.loadingUserCryptoAccounts = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };



    }
})();
