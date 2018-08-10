(function () {
    'use strict';

    angular.module('BlurAdmin.pages.register')
        .controller('RegisterCtrl', RegisterCtrl);

    /** @ngInject */
    function RegisterCtrl($rootScope,Rehive,$scope,errorHandler,$location,localStorageManagement) {

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
            Rehive.auth.registerCompany($scope.registerData).then(function (res) {
                $rootScope.pageTopObj.userInfoObj = {};
                $rootScope.pageTopObj.userInfoObj = res;
                var token = localStorageManagement.getValue('token');
                localStorageManagement.setValue('TOKEN','Token ' + token);
                $location.path('/verification');
                $scope.$apply();
            }, function (error) {
                $rootScope.$pageFinishedLoading = true;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

        $scope.fixformat = function(){
            $scope.registerData.company = $scope.registerData.company.toLowerCase();
            $scope.registerData.company = $scope.registerData.company.replace(/ /g, '_');
        };

    }
})();
