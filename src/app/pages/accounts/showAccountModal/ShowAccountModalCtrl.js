(function () {
    'use strict';

    angular.module('BlurAdmin.pages.accounts')
        .controller('ShowAccountModalCtrl', ShowAccountModalCtrl);

    /** @ngInject */
    function ShowAccountModalCtrl($scope,localStorageManagement,$uibModalInstance,
                                 errorHandler,account,$window,$state,Rehive) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        $scope.accountRef = account.reference;
        $scope.accountObj = {};
        $scope.loadingAccount = false;

        vm.getAccount = function(){
            if(vm.token) {
                $scope.loadingAccount = true;
                Rehive.admin.accounts.get({reference: $scope.accountRef}).then(function (res) {
                    $scope.loadingAccount = false;
                    if(res.group === "service"){
                        res.group = "extension";
                    }
                    $scope.accountObj = res;
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingAccount = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.getAccount();

        $scope.goToUserAccount = function () {
            $window.open('/#/user/' + $scope.accountObj.user.id + '/accounts?searchAccount=' + $scope.accountObj.reference,'_blank');
        };

        $scope.goToAccountTransactions = function () {
            $uibModalInstance.close();
            $state.go('transactions.history',{"accountRef": $scope.accountRef});
        };


    }
})();
