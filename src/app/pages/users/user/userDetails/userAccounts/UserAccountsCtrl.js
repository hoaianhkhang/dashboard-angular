(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('UserAccountsCtrl', UserAccountsCtrl);

    /** @ngInject */
    function UserAccountsCtrl($scope,environmentConfig,$stateParams,toastr,
                              $http,cookieManagement,errorHandler,$location,$state) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
        vm.uuid = $stateParams.uuid;
        vm.reference = '';
        $scope.newAccountCurrencies = {list: []};
        $scope.loadingUserAccounts = true;
        $scope.addingCurrencies = false;

        vm.getUser = function(){
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
        vm.getUser();

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

        $scope.addAccountCurrency = function(listOfCurrencies){

            var arrayOfCurrencies = [];

            listOfCurrencies.forEach(function (element) {
                arrayOfCurrencies.push({currency: element.code});
            });

            if(vm.token) {
                $scope.loadingUserAccounts = true;
                $http.post(environmentConfig.API + '/admin/accounts/' + vm.reference + '/currencies/',{currencies: arrayOfCurrencies}, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    console.log(res);
                    if (res.status === 201) {
                        $scope.newAccountCurrencies = {list: []};
                        toastr.success('New currencies have been added to the account');
                        $scope.toggleAddAccountCurrency();
                        vm.getUser();
                    }
                }).catch(function (error) {
                    $scope.newAccountCurrencies = {list: []};
                    $scope.loadingUserAccounts = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.toggleAddAccountCurrency = function (account) {
            if(account){
                vm.reference = account.reference;
            } else {
                vm.reference = ''
            }
            $scope.addingCurrencies = !$scope.addingCurrencies;
        };

        $scope.goToView = function(state,currency,email,account){
          $state.go(state,{"email": email, "account": account});
        };

        $scope.goToSettings = function(currencyCode, account){
            $location.path('user/' + vm.uuid + '/account/'+account+'/settings/'+ currencyCode);
        }

    }
})();
