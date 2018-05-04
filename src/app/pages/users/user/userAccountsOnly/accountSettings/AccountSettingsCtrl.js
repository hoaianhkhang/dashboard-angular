(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user.accountSettings')
        .controller('AccountSettingsCtrl', AccountSettingsCtrl);

    /** @ngInject */
    function AccountSettingsCtrl($scope,environmentConfig,localStorageManagement,$http,$stateParams,$location,$rootScope,errorHandler) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        $rootScope.shouldBeBlue = 'Users';
        $rootScope.accountBreadCrumbTitle = '';
        $scope.reference = $stateParams.reference;
        $scope.currencyCode = $stateParams.currencyCode;
        vm.uuid = $stateParams.uuid;
        $scope.settingView = 'controls';
        vm.location = $location.path();
        vm.locationArray = vm.location.split('/');
        $scope.locationIndicator = vm.locationArray[vm.locationArray.length - 1];
        $scope.subMenuLocation = $scope.locationIndicator;
        $scope.loadingAccount = false;

        vm.getUserAccount = function(){
            if(vm.token) {
                $scope.loadingAccount = true;
                $http.get(environmentConfig.API + '/admin/accounts/' + $scope.reference + '/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $scope.loadingAccount = false;
                        $scope.accountName = res.data.data.name;
                        $rootScope.accountBreadCrumbTitle = $scope.accountName + ' - ' + $scope.currencyCode;
                    }
                }).catch(function (error) {
                    $scope.loadingAccount = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        vm.getUserAccount();

        $scope.goToSetting = function(path){
            $scope.subMenuLocation = path;
            $location.path('user/' + vm.uuid + '/account/'+ $scope.reference +'/settings/' + $scope.currencyCode + '/' + path);
        };

        if($scope.subMenuLocation != 'limits' && $scope.subMenuLocation != 'fees'  && $scope.subMenuLocation != 'settings' ){
            $scope.goToSetting('limits');
        }

    }
})();
