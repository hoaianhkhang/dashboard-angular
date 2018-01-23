(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user.accounts')
        .controller('UserAccountsOnlyCtrl', UserAccountsOnlyCtrl);

    /** @ngInject */
    function UserAccountsOnlyCtrl($scope,environmentConfig,$stateParams,toastr,$uibModal,
                              $http,cookieManagement,errorHandler,$location,$state) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
        vm.uuid = $stateParams.uuid;
        vm.reference = '';
        $scope.newAccountCurrencies = {list: []};
        $scope.loadingUserAccounts = true;

        vm.getUserAccounts = function(){
            if(vm.token) {
                $scope.loadingUserAccounts = true;
                $http.get(environmentConfig.API + '/admin/accounts/?user=' + vm.uuid, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingUserAccounts = false;
                    if (res.status === 200) {
                        if(res.data.data.results.length > 0 ){
                            $scope.accounts = res.data.data.results;
                            $scope.account = res.data.data.results[0].user;
                            $scope.currencies = res.data.data.results[0].currencies;
                        } else {
                            $scope.accounts = [];
                        }

                    }
                }).catch(function (error) {
                    $scope.loadingUserAccounts = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        vm.getUserAccounts();

        vm.getCompanyCurrencies = function(){
            if(vm.token){
                $http.get(environmentConfig.API + '/admin/currencies/?enabled=true', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $scope.currencyOptions = res.data.data.results;
                    }
                }).catch(function (error) {
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        vm.getCompanyCurrencies();

        $scope.goToView = function(state,currency,email,account){
            $state.go(state,{"email": email, "account": account});
        };

        $scope.goToSettings = function(currencyCode, account){
            $location.path('user/' + vm.uuid + '/account/'+account+'/settings/'+ currencyCode);
        };

        $scope.openAddUserAccountOnlyModal = function (page, size) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'AddUserAccountOnlyModalCtrl',
                scope: $scope,
                resolve: {
                    uuid: function () {
                        return vm.uuid;
                    }
                }
            });

            vm.theModal.result.then(function(account){
                if(account){
                    vm.getUserAccounts();
                }
            }, function(){
            });
        };

        $scope.openAddAccountCurrenciesModal = function (page, size, reference,currencies) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'AddUserAccountOnlyCurrenciesModalCtrl',
                scope: $scope,
                resolve: {
                    reference: function () {
                        return reference;
                    },
                    currenciesList: function () {
                        return currencies;
                    }
                }
            });

            vm.theModal.result.then(function(account){
                if(account){
                    vm.getUserAccounts();
                }
            }, function(){
            });
        };

    }
})();
