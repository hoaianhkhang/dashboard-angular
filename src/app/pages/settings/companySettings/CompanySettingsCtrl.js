(function () {
    'use strict';

    angular.module('BlurAdmin.pages.settings.companySettings')
        .controller('CompanySettingsCtrl', CompanySettingsCtrl);

    /** @ngInject */
    function CompanySettingsCtrl($scope,Rehive,toastr,localStorageManagement,errorHandler) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        $scope.companyImageUrl = "/assets/img/app/placeholders/hex_grey.svg";
        $scope.loadingCompanySettings = true;
        $scope.company = {
            details : {
                settings: {}
            }
        };
        vm.updatedCompanySettings = {};
        vm.updatedCompanySettings = {
            settings: {}
        };
        $scope.companySettingsObj = {};
        $scope.statusOptions = ['Pending','Complete'];
        $scope.companyDateFormatString = localStorageManagement.getValue('DATE_FORMAT');
        $scope.companyDateFormat = ['MM/dd/yyyy','dd/MM/yyyy'];

        $scope.companyDateFormatChanged = function (companyDateFormatString) {
            localStorageManagement.setValue('DATE_FORMAT',companyDateFormatString);
        };

        vm.getCompanySettings = function () {
            if(vm.token) {
                $scope.loadingCompanySettings = true;
                Rehive.admin.company.get().then(function (res) {
                    $scope.loadingCompanySettings = false;
                    $scope.company.details = res;
                    $scope.companySettingsObj = $scope.company.details.settings;
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingCompanySettings = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.getCompanySettings();

        $scope.toggleCompanySettings = function (groupSetting,type) {

            var updatedSetting = {};

            if(type == 'default_transaction_status'){
                updatedSetting[type] = groupSetting;
            } else {
                updatedSetting[type] = !groupSetting;
            }

            if(vm.token) {
                Rehive.admin.company.settings.update(updatedSetting).then(function (res) {
                    $scope.companySettingsObj = {};
                    $scope.companySettingsObj = res;
                    toastr.success("Company setting successfully updated");
                    $scope.$apply();
                }, function (error) {
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

    }
})();
