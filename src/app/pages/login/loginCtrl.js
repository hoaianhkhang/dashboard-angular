(function () {
    'use strict';

    angular.module('BlurAdmin.pages.login')
        .controller('LoginCtrl', LoginCtrl);

    /** @ngInject */
    function LoginCtrl($rootScope,Rehive,$scope,localStorageManagement,$location,errorHandler,$intercom) {

        $intercom.shutdown();
        var vm = this;
        localStorageManagement.deleteValue('TOKEN');
        localStorageManagement.deleteValue('token');
        Rehive.removeToken();
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

                $intercom.boot({
                    email: res.user.email,
                    name: res.user.first_name + ' ' + res.user.last_name,
                    user_id: res.user.id,
                    company_id: res.user.company,
                    phone: res.user.mobile
                });

                vm.checkMultiFactorAuthEnabled(token);
            },function(error){
                $rootScope.$pageFinishedLoading = true;
                errorHandler.evaluateErrors(error);
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
                        $rootScope.$apply();
                    } else {
                        $rootScope.$pageFinishedLoading = true;
                        $location.path('/currencies');
                        $rootScope.$apply();
                    }
                }, function (error) {
                    $rootScope.$pageFinishedLoading = true;
                    errorHandler.evaluateErrors(error);
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
