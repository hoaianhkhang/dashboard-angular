(function () {
    'use strict';

    angular.module('BlurAdmin.pages.login')
        .controller('LoginCtrl', LoginCtrl);

    /** @ngInject */
    function LoginCtrl($rootScope,$scope,localStorageManagement,$location,
                       errorHandler,userVerification,Rehive) {

        var vm = this;
        localStorageManagement.deleteValue('TOKEN');
        localStorageManagement.deleteValue('token');
        $rootScope.dashboardTitle = 'Rehive';
        $scope.path = $location.path();
        $scope.showLoginPassword = false;

        $scope.toggleLoginPassword = function () {
            $scope.showLoginPassword = !$scope.showLoginPassword;
        };

        $scope.login = function(user, company, password) {
            $rootScope.$pageFinishedLoading = false;
            Rehive.auth.login({
                user: user,
                company: company,
                password: password
            }).then(function(res){
                var token = localStorageManagement.getValue('token');

                //remove this at the end of integrating sdk
                localStorageManagement.setValue('TOKEN','Token ' + token);
                //remove above line

                vm.checkMultiFactorAuthEnabled(token);
            },function(error){
                $rootScope.$pageFinishedLoading = true;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

        vm.checkMultiFactorAuthEnabled = function (token) {
            if(token) {
                Rehive.auth.mfa.status.get().then(function (res) {
                    var enabledObj = vm.checkMultiFactorAuthEnabledFromData(res);
                    if(enabledObj.enabled){
                        $rootScope.$pageFinishedLoading = true;
                        $location.path('/authentication/multi-factor/verify/' + enabledObj.key).search({prevUrl: 'login'});
                        $scope.$apply();
                    } else {
                        $rootScope.$pageFinishedLoading = false;
                        userVerification.verify(function(err,verified){
                            if(verified){
                                $rootScope.userFullyVerified = true;
                                $rootScope.$pageFinishedLoading = true;
                                $location.path('/currencies');
                                $scope.$apply();
                            } else {
                                $rootScope.userFullyVerified = false;
                                $rootScope.$pageFinishedLoading = false;
                                $location.path('/verification');
                                $scope.$apply();
                            }
                        });
                    }
                }, function (error) {
                    $rootScope.$pageFinishedLoading = true;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                    $rootScope.$apply();
                });
            }
        };

        vm.checkMultiFactorAuthEnabledFromData = function(multiFactorAuthObj){
            var enabledObj = {enabled: false,key: ''};
            for (var key in multiFactorAuthObj) {
                if (multiFactorAuthObj.hasOwnProperty(key)) {
                    if(multiFactorAuthObj[key] == true){
                        enabledObj.enabled = true;
                        enabledObj.key = key;
                        break;
                    }
                }
            }
            return enabledObj;
        };

    }
})();
