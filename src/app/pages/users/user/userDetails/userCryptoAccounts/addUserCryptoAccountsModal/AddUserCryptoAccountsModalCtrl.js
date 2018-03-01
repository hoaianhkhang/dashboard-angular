(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('AddUserCryptoAccountsModalCtrl', AddUserCryptoAccountsModalCtrl);

    function AddUserCryptoAccountsModalCtrl($scope,$uibModalInstance,toastr,$stateParams,$http,environmentConfig,cookieManagement,errorHandler) {

        var vm = this;
        vm.uuid = $stateParams.uuid;
        $scope.userCryptoAccountParams = {
            crypto_type: 'Bitcoin',
            user: vm.uuid,
            address: '',
            metadata: '',
            status: 'Pending'
        };
        $scope.cryptoStatusOptions = ['Pending', 'Incomplete', 'Declined', 'Obsolete', 'Verified'];
        vm.token = cookieManagement.getCookie('TOKEN');

        vm.isJson = function (str) {
            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }
            return true;
        };

        $scope.addUserCryptoAccount = function(userCryptoAccountParams){
            if(vm.token) {
                var metaData;
                if(userCryptoAccountParams.metadata){
                    if(vm.isJson(userCryptoAccountParams.metadata)){
                        metaData =  JSON.parse(userCryptoAccountParams.metadata);
                    } else {
                        toastr.error('Incorrect metadata format');
                        return false;
                    }
                } else {
                    metaData = {};
                }

                $scope.loadingUserCryptoAccounts = true;
                userCryptoAccountParams.crypto_type = userCryptoAccountParams.crypto_type.toLowerCase();
                userCryptoAccountParams.status = userCryptoAccountParams.status.toLowerCase();

                var newCryptoAccount = {
                    crypto_type: userCryptoAccountParams.crypto_type,
                    user: vm.uuid,
                    address: userCryptoAccountParams.address,
                    metadata: metaData,
                    status: userCryptoAccountParams.status
                };

                $http.post(environmentConfig.API + '/admin/users/crypto-accounts/',newCryptoAccount, {
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
                        $uibModalInstance.close(res.data);
                    }
                }).catch(function (error) {
                    $scope.loadingUserCryptoAccounts = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };



    }
})();
