(function () {
    'use strict';

    angular.module('BlurAdmin.pages.settings')
        .controller('SettingsCtrl', SettingsCtrl);

    /** @ngInject */
    function SettingsCtrl($rootScope,$scope,environmentConfig,Upload,$http,cookieManagement,errorHandler,$window,$timeout,$location) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
        $scope.settingView = 'accountInfo';
        $rootScope.dashboardTitle = 'Settings | Rehive';
        $scope.companyImageUrl = null;
        $scope.currencyOptions = JSON.parse($window.sessionStorage.currenciesList || '[]');
        $scope.updatingLogo = false;
        $scope.imageFile = {
          file: {}
        };

        vm.getCompanyDetails = function(){
            if(vm.token) {
                $http.get(environmentConfig.API + '/admin/company/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $scope.companyImageUrl = res.data.data.logo;
                    }
                }).catch(function (error) {
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
          };
          vm.getCompanyDetails();

        $scope.goToCompanyLogo = function(view){
            $location.path('settings');
            $scope.settingView = view;
        };

        $scope.goToSetting = function(path){
            $scope.settingView = '';
            $location.path(path);
        };

        $scope.upload = function (file) {
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
            })
        };

    }
})();
