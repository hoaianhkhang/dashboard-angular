(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.bitcoinService.bitcoinServiceAccounts')
        .controller('BitcoinServiceAccountsCtrl', BitcoinServiceAccountsCtrl);

    /** @ngInject */
    function BitcoinServiceAccountsCtrl($rootScope, $scope,$timeout) {
        $rootScope.dashboardTitle = 'Bitcoin service | Rehive';
        $scope.bitcoinAccountSettingView = '';

        $scope.goToBitcoinAccountSetting = function (setting) {
            $scope.bitcoinAccountSettingView = setting;
        };
        $timeout(function () {
            $scope.goToBitcoinAccountSetting('hotwallet');
        },200);
    }

})();
