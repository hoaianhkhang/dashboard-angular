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
        $scope.isBankDetailsCollapsed = true;
        $scope.uncollapsedBank = {};
        $scope.loadingUserBankAccount = true;
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

        $scope.openAddUserBankAccountModal = function (page, size) {
            $scope.uncollapsedBank = {};
            $scope.isBankDetailsCollapsed = true;
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'AddUserBankAccountModalCtrl',
                scope: $scope
            });

            vm.theModal.result.then(function(bankAccount){
                if(bankAccount){
                    vm.getUserBankAccounts();
                }
            }, function(){
            });
        };

        $scope.openEditUserBankAccountModal = function (page, size, bankAccount) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'EditUserBankAccountModalCtrl',
                scope: $scope,
                resolve: {
                    bankAccount: function () {
                        return bankAccount;
                    }
                }
            });

            vm.theModal.result.then(function(bankAccount){
                if(bankAccount){
                    vm.getUserBankAccounts();
                }
            }, function(){
            });
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

            vm.theModal.result.then(function(bankAccount){
                if(bankAccount){
                    vm.getUserBankAccounts();
                }
            }, function(){
            });
        };


    }
})();
