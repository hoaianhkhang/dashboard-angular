(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('UserBankAccountsCtrl', UserBankAccountsCtrl);

    /** @ngInject */
    function UserBankAccountsCtrl($scope,environmentConfig,$stateParams,$uibModal,$http,$window,
                                  cookieManagement,errorHandler,toastr,$filter,$ngConfirm) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
        vm.uuid = $stateParams.uuid;
        vm.updatedUserBankAccount = {};
        $scope.isBankDetailsCollapsed = true;
        $scope.uncollapsedBank = {};
        $scope.userBankAccountParams = {status: 'Pending'};
        $scope.editUserBankAccount = {};
        $scope.loadingUserBankAccount = true;
        $scope.addingUserBankAccount = false;
        $scope.statusOptions = ['Pending', 'Incomplete', 'Declined', 'Verified'];

        vm.getUserBankAccounts = function(){
            if(vm.token) {
                $scope.loadingUserBankAccount = true;
                $http.get(environmentConfig.API + '/admin/users/bank-accounts/?user=' + vm.uuid, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingUserBankAccount = false;
                    if (res.status === 200) {
                        $scope.userBanks = res.data.data.results;
                        $window.sessionStorage.userBanks = JSON.stringify(res.data.data.results);
                    }
                }).catch(function (error) {
                    $scope.loadingUserBankAccount = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        vm.getUserBankAccounts();

        $scope.toggleAddUserBankAccountView = function () {
            $scope.isBankDetailsCollapsed = true;
            $scope.addingUserBankAccount = !$scope.addingUserBankAccount;
        };

        $scope.addUserBankAccount = function(userBankAccountParams){
            if(vm.token) {
                userBankAccountParams.user = vm.uuid;
                $scope.loadingUserBankAccount = true;
                $scope.toggleAddUserBankAccountView();
                userBankAccountParams.status = userBankAccountParams.status.toLowerCase();
                $http.post(environmentConfig.API + '/admin/users/bank-accounts/',userBankAccountParams,{
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingUserBankAccount = false;
                    if (res.status === 201) {
                        $scope.userBankAccountParams = {status: 'pending'};
                        toastr.success('Successfully added user bank account!');
                        vm.getUserBankAccounts();
                    }
                }).catch(function (error) {
                    $scope.loadingUserBankAccount = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.toggleEditUserBankAccountView = function (userBankAccount) {
            $scope.isBankDetailsCollapsed = true;
            if(userBankAccount){
                vm.getUserBankAccount(userBankAccount);
            } else {
                $scope.editUserBankAccount = {};
                vm.getUserBankAccounts();
            }
            $scope.editingUserBankAccount = !$scope.editingUserBankAccount;
        };

        vm.getUserBankAccount = function (userBankAccount) {
            $scope.loadingUserBankAccount = true;
            $http.get(environmentConfig.API + '/admin/users/bank-accounts/' + userBankAccount.id + '/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.loadingUserBankAccount = false;
                if (res.status === 200) {
                    $scope.editUserBankAccount = res.data.data;
                    $scope.editUserBankAccount.status = $filter('capitalizeWord')(res.data.data.status);
                }
            }).catch(function (error) {
                $scope.loadingUserBankAccount = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        $scope.userBankAccountChanged =  function (field) {
            vm.updatedUserBankAccount[field] = $scope.editUserBankAccount[field];
        };

        $scope.updateUserBankAccount = function(){
            if(vm.token) {
                $scope.loadingUserBankAccount = true;
                $scope.editingUserBankAccount = !$scope.editingUserBankAccount;
                vm.updatedUserBankAccount.status ? vm.updatedUserBankAccount.status = vm.updatedUserBankAccount.status.toLowerCase() : '';
                $http.patch(environmentConfig.API + '/admin/users/bank-accounts/' + $scope.editUserBankAccount.id + '/',vm.updatedUserBankAccount,{
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingUserBankAccount = false;
                    if (res.status === 200) {
                        vm.updatedUserBankAccount = {};
                        $scope.editUserBankAccount = {};
                        toastr.success('Successfully updated user bank account');
                        vm.getUserBankAccounts();
                    }
                }).catch(function (error) {
                    $scope.loadingUserBankAccount = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.userAddressChanged =  function (field) {
            vm.updatedUserAddress[field] = $scope.editUserAddress[field];
        };

        $scope.verifyBankAccountConfirm = function (bank) {
            $ngConfirm({
                title: 'Verify user bank account',
                content: 'Are you sure you want to verify this bank account?',
                animationBounce: 1,
                animationSpeed: 100,
                scope: $scope,
                buttons: {
                    close: {
                        text: "No",
                        btnClass: 'btn-default pull-left dashboard-btn'
                    },
                    ok: {
                        text: "Yes",
                        btnClass: 'btn-primary dashboard-btn',
                        keys: ['enter'], // will trigger when enter is pressed
                        action: function(scope){
                            $scope.verifyBankAccount(bank);
                        }
                    }
                }
            });
        };

        $scope.verifyBankAccount = function(bank){
            if(vm.token) {
                $scope.loadingUserBankAccount = true;
                $http.patch(environmentConfig.API + '/admin/users/bank-accounts/' + bank.id + '/',{status: 'verified'},{
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingUserBankAccount = false;
                    if (res.status === 200) {
                        toastr.success('Bank account verified');
                        vm.getUserBankAccounts();
                    }
                }).catch(function (error) {
                    $scope.loadingUserBankAccount = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.showCollapsedBankDetails = function (bank) {
            if(bank.id == $scope.uncollapsedBank.id){
                $scope.isBankDetailsCollapsed = true;
            } else {
                $scope.isBankDetailsCollapsed = false;
            }

            if($scope.isBankDetailsCollapsed){
                $scope.uncollapsedBank = {};
            } else {
                $scope.uncollapsedBank = bank;
            }
        };


        $scope.openUserBankAccountModal = function (page, size, bankAccount) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'UserBankAccountModalCtrl',
                scope: $scope,
                resolve: {
                    bankAccount: function () {
                        return bankAccount;
                    }
                }
            });

            vm.theModal.result.then(function(address){
                if(address){
                    vm.getUserBankAccounts();
                }
            }, function(){
            });
        };


    }
})();
