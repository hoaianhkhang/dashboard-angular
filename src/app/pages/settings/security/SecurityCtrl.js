(function () {
    'use strict';

    angular.module('BlurAdmin.pages.settings.security')
        .controller('SecurityCtrl', SecurityCtrl);

    /** @ngInject */
    function SecurityCtrl($scope,Rehive,$uibModal,$location,localStorageManagement,errorHandler) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        $scope.loadingAPITokens = true;
        $scope.addingToken = false;
        $scope.createTokenData = {};
        $scope.createTokenData.tokenPassword = '';
        $scope.createTokenData.tokenDuration = '';
        $scope.activatedMfa = 'None';

        vm.checkMultiFactorAuthEnabled = function () {
            if(vm.token) {
                Rehive.auth.mfa.status.get().then(function (res) {
                    for(var key in res){
                        if (res.hasOwnProperty(key)) {
                            if(res[key]){
                                $scope.activatedMfa = key;
                                $scope.$apply();
                            }
                        }
                    }
                }, function (error) {
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.checkMultiFactorAuthEnabled();

        vm.getTokensList = function () {
            if(vm.token) {
                $scope.loadingAPITokens = true;
                Rehive.auth.tokens.get().then(function(res){
                    $scope.loadingAPITokens = false;
                    $scope.tokensList = res;
                    $scope.$apply();
                },function(error){
                    $scope.loadingAPITokens = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.getTokensList();

        $scope.addToken = function(){
            if(vm.token) {
              $scope.loadingAPITokens = true;
                Rehive.auth.tokens.create({
                    password: $scope.createTokenData.tokenPassword,
                    duration: $scope.createTokenData.tokenDuration ? $scope.createTokenData.tokenDuration: 0}).then(function(res)
                {
                    $scope.createTokenData.tokenDuration = '';
                    $scope.createTokenData.tokenPassword = '';
                    $scope.addingToken = false;
                    vm.getTokensList();
                    vm.openShowTokenModal('app/pages/settings/security/tokens/showTokenModal/showTokenModal.html','md',res.token);
                    $scope.$apply();
                },function(error){
                    $scope.loadingAPITokens = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.openDeleteTokenModal = function (page, size,token) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'DeleteTokenModalCtrl',
                scope: $scope,
                resolve: {
                    token: function () {
                        return token;
                    }
                }
            });

            vm.theModal.result.then(function(token){
                if(token){
                    vm.getTokensList();
                }
            }, function(){
            });
        };

        vm.openShowTokenModal = function (page, size,token) {
            $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'ShowTokenModalCtrl',
                scope: $scope,
                resolve: {
                    token: function () {
                        return token;
                    }
                }
            });
        };

        $scope.goToAddTokenView = function(){
            $scope.addingToken = true;
        };

        $scope.goBackToListTokensView = function () {
            $scope.addingToken = false;
        };

        $scope.changePassword = function(){
            $location.path('/password/change');
        };

        $scope.enableMultiFactorAuth = function(){
            $location.path('/authentication/multi-factor');
        };

    }
})();
