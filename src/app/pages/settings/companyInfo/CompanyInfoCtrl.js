(function () {
    'use strict';

    angular.module('BlurAdmin.pages.settings.companyInfo')
        .controller('CompanyInfoCtrl', CompanyInfoCtrl);

    /** @ngInject */
    function CompanyInfoCtrl($scope,Rehive,$rootScope,Upload,environmentConfig,
                             $timeout,toastr,localStorageManagement,errorHandler,_) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        $scope.companyImageUrl = null;
        $scope.companyImageUrl = "/assets/img/app/placeholders/hex_grey.svg";
        $scope.updatingLogo = false;
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
        $scope.imageFile = {
            file: {}
        };

        $scope.upload = function () {
            if(!$scope.imageFile.file.name){
                return;
            }
            $scope.updatingLogo = true;
            Upload.upload({
                url: environmentConfig.API +'/admin/company/',
                data: {
                    logo: $scope.imageFile.file
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token},
                method: "PATCH"
            }).then(function (res) {
                if (res.status === 200) {
                    $timeout(function(){
                        $scope.companyImageUrl = res.data.data.logo;
                        $scope.updatingLogo = false;
                    },0);
                    //$window.location.reload();
                }
            }).catch(function (error) {
                $scope.updatingLogo = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        vm.getCompanyInfo = function () {
            if(vm.token) {
                $scope.loadingCompanyInfo = true;
                Rehive.admin.company.get().then(function (res) {
                    $scope.loadingCompanyInfo = false;
                    if(Object.keys(res.config).length == 0){
                        res.config = '';
                    } else {
                        res.config = JSON.stringify(res.config);
                    }
                    $scope.company.details = res;
                    $scope.companyImageUrl = res.logo;
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
            if(field == 'public'){
                $scope.company.details[field] = !$scope.company.details[field];
            }
            vm.updatedCompanyInfo[field] = $scope.company.details[field];
        };

        var isJson = function (str) {
            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }
            return true;
        };

        $scope.updateCompanyInfo = function () {
            $scope.loadingCompanyInfo = true;

            if(vm.updatedCompanyInfo.config){
                vm.updatedCompanyInfo.config = JSON.parse(vm.updatedCompanyInfo.config);
            } else if(vm.updatedCompanyInfo.config ===''){
                vm.updatedCompanyInfo.config = {};
            }

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
