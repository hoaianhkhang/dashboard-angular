(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('UserAccountsCtrl', UserAccountsCtrl);

    /** @ngInject */
    function UserAccountsCtrl($scope,environmentConfig,$stateParams,$uibModal,
                              $http,cookieManagement,errorHandler,$location,$state) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
        vm.uuid = $stateParams.uuid;
        vm.reference = '';
        $scope.newAccountCurrencies = {list: []};
        $scope.loadingUserAccounts = true;
        $scope.addingCurrencies = false;

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
                        $scope.accounts = res.data.data.results;
                        $scope.account = res.data.data.results[0].user;
                        $scope.currencies = res.data.data.results[0].currencies;
                    }
                }).catch(function (error) {
                    $scope.loadingUserAccounts = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        vm.getUserAccounts();

        $scope.openAddAccountCurrenciesModal = function (page, size, reference) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'AddAccountCurrenciesModalCtrl',
                scope: $scope,
                resolve: {
                    reference: function () {
                        return reference;
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

        $scope.goToView = function(state,email,account){
          $state.go(state,{"email": email, "account": account});
        };

        $scope.goToSettings = function(currencyCode, account){
            $location.path('user/' + vm.uuid + '/account/'+account+'/settings/'+ currencyCode);
        };

    }
})();
