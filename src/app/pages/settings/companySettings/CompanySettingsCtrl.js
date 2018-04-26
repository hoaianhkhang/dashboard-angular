(function () {
    'use strict';

    angular.module('BlurAdmin.pages.settings.companySettings')
        .controller('CompanySettingsCtrl', CompanySettingsCtrl);

    /** @ngInject */
    function CompanySettingsCtrl($scope,environmentConfig,$rootScope,toastr,$http,localStorageManagement,errorHandler,_) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
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

        vm.getCompanySettings = function () {
            if(vm.token) {
                $scope.loadingCompanySettings = true;
                $http.get(environmentConfig.API + '/admin/company/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingCompanySettings = false;
                    if (res.status === 200) {
                        $scope.company.details = res.data.data;
                        $scope.companySettingsObj = $scope.company.details.settings;
                    }
                }).catch(function (error) {
                    $scope.loadingCompanySettings = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
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
                $http.patch(environmentConfig.API + '/admin/company/settings/',updatedSetting, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $scope.companySettingsObj = {};
                        $scope.companySettingsObj = res.data.data;
                        toastr.success("Company setting successfully updated");
                    }
                }).catch(function (error) {
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

    }
})();
