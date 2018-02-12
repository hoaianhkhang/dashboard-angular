(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.ethereumService.ethereumServiceSettings')
        .controller('EthereumServiceSettingsCtrl', EthereumServiceSettingsCtrl);

    /** @ngInject */
    function EthereumServiceSettingsCtrl($rootScope,$scope,cookieManagement) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
        $rootScope.dashboardTitle = 'Rehive | Ethereum service';
        $scope.ethereumSettingView = '';
        $scope.loadingHdkeys =  true;
        $scope.addingHdkey =  false;

        $scope.goToEthereumSetting = function (setting) {
            $scope.ethereumSettingView = setting;
        };

    }
})();
