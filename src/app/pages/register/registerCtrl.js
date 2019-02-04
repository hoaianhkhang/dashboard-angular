(function () {
    'use strict';

    angular.module('BlurAdmin.pages.register')
        .controller('RegisterCtrl', RegisterCtrl);

    /** @ngInject */
    function RegisterCtrl($rootScope,Rehive,$scope,errorHandler,$location,localStorageManagement, identifySearchInput) {

        //var vm = this;
        $scope.path = $location.path();
        $scope.registerData = {
            email: '',
            company: '',
            password1: '',
            terms_and_conditions: false,
            privacy_policy: false
        };
        $scope.showPassword1 = false;
        $scope.invalidEmailData = false;
        $scope.invalidCompanyIdData = false;

        $scope.togglePasswordVisibility1 = function () {
            $scope.showPassword1 = !$scope.showPassword1;
        };

        $scope.registerUser = function() {
            $rootScope.$pageFinishedLoading = false;
            $scope.registerData.password2 = $scope.registerData.password1;
            $scope.registerData.privacy_policy = $scope.registerData.terms_and_conditions;
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

        $scope.validateCompanyEmail = function(){
            $scope.invalidEmailData =  !identifySearchInput.isEmail($scope.registerData.email);
        };

        $scope.validateCompanyId = function(){
            $scope.invalidCompanyIdData =  !identifySearchInput.isCompanyId($scope.registerData.company);
        };

        $scope.fixformat = function(){
            $scope.registerData.company = $scope.registerData.company.toLowerCase();
            $scope.registerData.company = $scope.registerData.company.replace(/ /g, '_');
            $scope.registerData.company = $scope.registerData.company.trim();
        };

    }
})();
