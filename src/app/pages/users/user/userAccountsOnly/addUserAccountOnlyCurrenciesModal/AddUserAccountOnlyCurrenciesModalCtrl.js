(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user.accounts')
        .controller('AddUserAccountOnlyCurrenciesModalCtrl', AddUserAccountOnlyCurrenciesModalCtrl);

    function AddUserAccountOnlyCurrenciesModalCtrl($scope,$uibModalInstance,toastr,reference,currenciesList,
                                                   $http,environmentConfig,cookieManagement,errorHandler) {

        var vm = this;
        vm.reference = reference;
        $scope.currenciesList = currenciesList;
        $scope.loadingUserAccounts = true;
        $scope.newAccountCurrencies = {list: []};
        vm.token = cookieManagement.getCookie('TOKEN');

        vm.getCompanyCurrencies = function(){
            $scope.loadingUserAccounts = true;
            if(vm.token){
                $http.get(environmentConfig.API + '/admin/currencies/?enabled=true', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $scope.loadingUserAccounts = false;
                        $scope.currencyOptions = res.data.data.results;
                    }
                }).catch(function (error) {
                    $scope.loadingUserAccounts = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        vm.getCompanyCurrencies();




    }
})();
