(function () {
    'use strict';

    angular.module('BlurAdmin.pages.settings.companyInfo')
        .controller('CompanyInfoCtrl', CompanyInfoCtrl);

    /** @ngInject */
    function CompanyInfoCtrl($scope,Rehive,$rootScope,Upload,environmentConfig,serializeFiltersService,
                             $timeout,toastr,localStorageManagement,errorHandler, $state) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        // $scope.companyImageUrl = "../../../assets/img/app/placeholders/_defaultLogo.svg";
        // $scope.companyIconUrl = "../../../assets/img/app/placeholders/_defaultIcon.svg";
        $scope.companyImageUrl = "";
        $scope.companyIconUrl = "";
        $scope.hasLogo = false;
        $scope.hasIcon = false;
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
            file: {},
            iconFile: {}
        };
        $scope.editorEnabled= false;

        $scope.editorEmailOptions = {
            lineWrapping : true,
            lineNumbers: true,
            theme: 'monokai',
            autoCloseTags: true,
            smartIndent: false,
            mode: 'xml'
        };

        $scope.enableEditor = function() {
            //used to refresh the codemirror element to display latest ng-model
            $scope.editorEnabled = true;
        };

        $scope.upload = function () {
            if(!$scope.imageFile.file.name && !$scope.imageFile.iconFile.name){
                return;
            }
            $scope.updatingLogo = true;

            var uploadDataObj = {
                logo: $scope.imageFile.file.name ? $scope.imageFile.file: null,
                icon: $scope.imageFile.iconFile.name ? $scope.imageFile.iconFile: null
            };

            Upload.upload({
                url: environmentConfig.API +'/admin/company/',
                data: serializeFiltersService.objectFilters(uploadDataObj),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token},
                method: "PATCH"
            }).then(function (res) {
                if (res.status === 200) {
                    $timeout(function(){
                        $scope.companyImageUrl = res.data.data.logo;
                        $scope.updatingLogo = false;
                    },10);
                    //$window.location.reload();
                }
                toastr.success('Image(s) uploaded successfully. Refresh the page to see changes.');
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
                    if(res.config){
                        if(Object.keys(res.config).length == 0){
                            res.config = '';
                        } else {
                            res.config = JSON.stringify(res.config,null,4);
                        }
                    }
                    $scope.company.details = res;
                    if(res.logo !== null && res.logo !== ""){$scope.companyImageUrl = res.logo; $scope.hasLogo = true;}
                    if(res.icon !== null && res.icon !== ""){$scope.companyIconUrl = res.icon; $scope.hasIcon = true;}
                    $scope.enableEditor();
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
            //reintailize scopes
            $scope.editorEnabled = false;
            $scope.company = {
                details : {
                    settings: {}
                }
            };

            if(vm.updatedCompanyInfo.config){
                if(isJson(vm.updatedCompanyInfo.config)){
                    vm.updatedCompanyInfo.config = JSON.parse(vm.updatedCompanyInfo.config);
                } else {
                    toastr.error('Must be a valid json object','Config');
                    vm.updatedCompanyInfo.config = $scope.company.details.config;
                    vm.getCompanyInfo();
                    return;
                }
            } else if(vm.updatedCompanyInfo.config ===''){
                vm.updatedCompanyInfo.config = {};
            }
            console.log(vm.updatedCompanyInfo);
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
