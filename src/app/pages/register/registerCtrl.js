(function () {
    'use strict';

    angular.module('BlurAdmin.pages.register')
        .controller('RegisterCtrl', RegisterCtrl);

    /** @ngInject */
    function RegisterCtrl($rootScope,$scope,$http,environmentConfig,errorHandler,$location,cookieManagement) {

        //var vm = this;
        $scope.path = $location.path();
        $scope.registerData = {
            first_name: '',
            last_name: '',
            email: '',
            company: '',
            password1: '',
            password2: '',
            terms_and_conditions: false
        };
        $scope.showPassword1 = false;
        $scope.showPassword2 = false;

        $scope.togglePasswordVisibility1 = function () {
            $scope.showPassword1 = !$scope.showPassword1;
        };

        $scope.togglePasswordVisibility2 = function () {
            $scope.showPassword2 = !$scope.showPassword2;
        };

        $scope.registerUser = function() {
            $rootScope.$pageFinishedLoading = false;
            $http.post(environmentConfig.API + '/auth/company/register/', $scope.registerData)
                .then(function (res) {
                    if (res.status === 201) {
                        cookieManagement.setCookie('TOKEN','Token ' + res.data.data.token);
                        $location.path('/verification');
                        $rootScope.$pageFinishedLoading = true;
                        $rootScope.userFullyVerified = false;
                    } else {

                    }
            }).catch(function (error) {
                $rootScope.$pageFinishedLoading = true;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        $scope.fixformat = function(){
            $scope.registerData.company = $scope.registerData.company.toLowerCase();
            $scope.registerData.company = $scope.registerData.company.replace(/ /g, '_');
        }

    }
})();
