(function () {
    'use strict';

    angular.module('BlurAdmin.pages.newCompanySetup.setupCompany')
        .controller("SetupCompanyCtrl", SetupCompanyCtrl);

    function SetupCompanyCtrl($rootScope,$scope,toastr,Rehive,serializeFiltersService,
                              $location,errorHandler,localStorageManagement) {
        var vm = this;
        vm.token = localStorageManagement.getValue("token");
        $scope.loadingCompanyDetails = false;
        $rootScope.activeSetupRoute = 0;
        localStorageManagement.setValue('activeSetupRoute',0);
        $scope.company = {
            name: ''
        };

        $scope.companyNameChange = function () {
            if($scope.company.name){
                $rootScope.setupCompany = 1;
                localStorageManagement.setValue('setupCompany',1);
            } else {
                $rootScope.setupCompany = 0;
                localStorageManagement.setValue('setupCompany',0);
            }
        };

        $scope.goToNextView = function () {
            $location.path('company/setup/groups');
        };

        vm.getCompanyInfo = function () {
            if(vm.token) {
                $scope.loadingCompanyDetails = true;
                Rehive.admin.company.get().then(function (res) {
                    if(res && res.name){
                        $scope.company = res;
                        $rootScope.pageTopObj.companyObj = {};
                        $rootScope.pageTopObj.companyObj = res;
                        $rootScope.setupCompany = 1;
                        localStorageManagement.setValue('setupCompany',1);
                        $scope.loadingCompanyDetails = false;
                        $scope.$apply();
                    } else {
                        $rootScope.setupCompany = 0;
                        localStorageManagement.setValue('setupCompany',0);
                        $scope.loadingCompanyDetails = false;
                        $scope.$apply();
                    }
                }, function (error) {
                    $scope.loadingCompanyDetails = false;
                    errorHandler.evaluateErrors(error);
                    if(error.status == 403){
                        $location.path('/login');
                    }
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.getCompanyInfo();

        $scope.updateCompanyInfo = function (company) {
            $scope.loadingCompanyDetails = true;
            Rehive.admin.company.update(serializeFiltersService.objectFilters(company)).then(function (res) {
                $rootScope.pageTopObj.companyObj = {};
                $rootScope.pageTopObj.companyObj = res;
                // toastr.success('You have successfully updated the company info');
                $scope.loadingCompanyDetails = false;
                if(res && res.name){
                    $rootScope.setupCompany = 1;
                    localStorageManagement.setValue('setupCompany',1);
                } else {
                    $rootScope.setupCompany = 0;
                    localStorageManagement.setValue('setupCompany',0);
                }
                $scope.goToNextView();
                $scope.$apply();
            }, function (error) {
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.loadingCompanyDetails = false;
                $scope.$apply();
            });
        };

    }
})();
