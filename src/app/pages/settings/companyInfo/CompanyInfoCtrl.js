(function () {
    'use strict';

    angular.module('BlurAdmin.pages.settings.companyInfo')
        .controller('CompanyInfoCtrl', CompanyInfoCtrl);

    /** @ngInject */
    function CompanyInfoCtrl($scope,Rehive,$rootScope,toastr,localStorageManagement,errorHandler,_) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        $scope.companyImageUrl = "/assets/img/app/placeholders/hex_grey.svg";
        $scope.loadingCompanyInfo = true;
        $scope.company = {
            details : {
                settings: {}
            }
        };
        vm.updatedCompanyInfo = {};
        vm.updatedCompanySettings = {
            settings: {}
        };
        $scope.statusOptions = ['Pending','Complete'];

        vm.getCompanyInfo = function () {
            if(vm.token) {
                $scope.loadingCompanyInfo = true;
                Rehive.admin.company.get().then(function (res) {
                    $scope.loadingCompanyInfo = false;
                    $scope.company.details = res;
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingCompanyInfo = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.getCompanyInfo();

        $scope.companySettingsChanged = function(field){
            vm.updatedCompanySettings.settings[field] = $scope.company.details.settings[field];
        };

        $scope.updateCompanySettings = function () {
            if(Object.keys(vm.updatedCompanySettings.settings).length != 0){

                $scope.loadingCompanyInfo = true;
                Rehive.admin.company.settings.update(vm.updatedCompanySettings.settings).then(function (res) {
                    vm.updatedCompanySettings.settings = {};
                    vm.getCompanyInfo();
                    toastr.success('You have successfully updated the company info');
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingCompanyInfo = false;
                    vm.updatedCompanyInfo = {};
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            } else{
                vm.getCompanyInfo();
                toastr.success('You have successfully updated the company info');
            }
        };

        $scope.companyInfoChanged = function(field){
            vm.updatedCompanyInfo[field] = $scope.company.details[field];
        };

        $scope.updateCompanyInfo = function () {
            $scope.loadingCompanyInfo = true;

            Rehive.admin.company.update(vm.updatedCompanyInfo).then(function (res) {
                vm.updatedCompanyInfo = {};
                $scope.company.details = {};
                $rootScope.pageTopObj.companyObj = {};
                $rootScope.pageTopObj.companyObj = res;
                $scope.updateCompanySettings();
                $scope.$apply();
            }, function (error) {
                $scope.loadingCompanyInfo = false;
                vm.updatedCompanyInfo = {};
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

    }
})();
