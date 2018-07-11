(function () {
    'use strict';

    angular.module('BlurAdmin.pages.settings.security')
        .controller('SecurityCtrl', SecurityCtrl);

    /** @ngInject */
    function SecurityCtrl($scope,$uibModal,$location,environmentConfig,$http,localStorageManagement,errorHandler) {

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
                $http.get(environmentConfig.API + '/auth/mfa/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        for(var key in res.data.data){
                            if (res.data.data.hasOwnProperty(key)) {
                                if(res.data.data[key]){
                                    $scope.activatedMfa = key;
                                }
                            }
                        }
                    }
                }).catch(function (error) {
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        vm.checkMultiFactorAuthEnabled();

        vm.getTokensList = function () {
            if(vm.token) {
                $scope.loadingAPITokens = true;
                $http.get(environmentConfig.API + '/auth/tokens/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingAPITokens = false;
                    if (res.status === 200) {
                        $scope.tokensList = res.data.data;
                    }
                }).catch(function (error) {
                    $scope.loadingAPITokens = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        vm.getTokensList();

        $scope.addToken = function(){
            if(vm.token) {
              $scope.loadingAPITokens = true;
                $http.post(environmentConfig.API + '/auth/tokens/',{password: $scope.createTokenData.tokenPassword,duration: $scope.createTokenData.tokenDuration ? $scope.createTokenData.tokenDuration: 0}, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 201) {
                        $scope.createTokenData.tokenDuration = '';
                        $scope.createTokenData.tokenPassword = '';
                        $scope.addingToken = false;
                        vm.getTokensList();
                        vm.openShowTokenModal('app/pages/settings/security/tokens/showTokenModal/showTokenModal.html','md',res.data.data.token);
                    }
                }).catch(function (error) {
                    $scope.loadingAPITokens = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.openDeleteTokenModal = function (page, size,token) {
            $uibModal.open({
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

        $scope.enableMultiFactorAuth = function(){
            $location.path('/authentication/multi-factor');
        };

    }
})();
