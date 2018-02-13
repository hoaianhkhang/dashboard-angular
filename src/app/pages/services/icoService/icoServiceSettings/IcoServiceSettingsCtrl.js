(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.icoService.icoServiceSettings')
        .controller('IcoServiceSettingsCtrl', IcoServiceSettingsCtrl);

    /** @ngInject */
    function IcoServiceSettingsCtrl($rootScope,$scope,$http,cookieManagement,errorHandler,$state,toastr) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
        vm.serviceUrl = cookieManagement.getCookie('SERVICEURL');
        $rootScope.dashboardTitle = 'Ico service | Rehive';
        $scope.updatingCompanyInfo = false;
        $scope.icoSettingView = '';
        $scope.company = {
            name: ''
        };

        $scope.goToIcoSetting = function (setting) {
            $scope.icoSettingView = setting;
        };

        vm.getCompanyInfo = function () {
            $scope.updatingCompanyInfo =  true;
            if(vm.token) {
                $http.get(vm.serviceUrl + 'admin/company/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.updatingCompanyInfo =  false;
                    if (res.status === 200) {
                        $scope.company = res.data.data;
                    }
                }).catch(function (error) {
                    $scope.updatingCompanyInfo =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        vm.getCompanyInfo();

        $scope.updateCompanyInfo = function () {
            $scope.updatingCompanyInfo =  true;
            if(vm.token) {
                $http.patch(vm.serviceUrl + 'admin/company/', $scope.company, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.updatingCompanyInfo =  false;
                    if (res.status === 200) {
                        $scope.company = res.data.data;
                        toastr.success('Company info updated successfully');
                    }
                }).catch(function (error) {
                    $scope.updatingCompanyInfo =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.goToTransactionsWebhooks = function(secret){
            $state.go('webhooks.list',{"secret": secret});
        };


        $scope.goToGeneralWebhooks = function(secret){
            $state.go('webhooks.list',{"secret": secret});
        };

    }

})();
