(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.bitcoinService.bitcoinServiceSettings')
        .controller('BitcoinServiceSettingsCtrl', BitcoinServiceSettingsCtrl);

    /** @ngInject */
    function BitcoinServiceSettingsCtrl($rootScope,$scope) {

        $rootScope.dashboardTitle = 'Bitcoin service | Rehive';
        $scope.bitcoinSettingView = '';
        $scope.loadingHdkeys =  true;
        $scope.addingHdkey =  false;

        $scope.goToBitcoinSetting = function (setting) {
            $scope.bitcoinSettingView = setting;
        };
    }

})();
