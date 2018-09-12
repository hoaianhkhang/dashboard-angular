(function () {
    'use strict';

    angular.module('BlurAdmin.pages.companyInfoRequest')
        .controller('CompanyInfoRequestCtrl', CompanyInfoRequestCtrl);

    /** @ngInject */

    function CompanyInfoRequestCtrl($rootScope,Rehive,$scope,toastr,localStorageManagement,
                                    $location,errorHandler) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        $rootScope.$pageFinishedLoading = false;
        $scope.company = {
            name: ''
        };

        $scope.goToNextView = function(){
            $location.path('company/setup/initial');
        };

        vm.getCompanyInfo = function () {
            if(vm.token) {
                Rehive.admin.company.get().then(function (res) {
                    if(res && res.name){
                        $rootScope.pageTopObj.companyObj = {};
                        $rootScope.pageTopObj.companyObj = res;
                        $location.path('company/setup/initial');
                        $scope.$apply();
                    } else {
                        $rootScope.$pageFinishedLoading = true;
                        $scope.$apply();
                    }
                }, function (error) {
                    $rootScope.$pageFinishedLoading = true;
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
            $rootScope.$pageFinishedLoading = false;
            Rehive.admin.company.update(company).then(function (res) {
                $rootScope.pageTopObj.companyObj = {};
                $rootScope.pageTopObj.companyObj = res;
                toastr.success('You have successfully updated the company info');
                $location.path('company/setup/initial');
                $scope.$apply();
            }, function (error) {
                $rootScope.$pageFinishedLoading = true;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

    }
})();
