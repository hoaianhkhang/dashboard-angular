(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.bitcoinService.bitcoinServiceAccounts')
        .controller('BitcoinServiceAccountsCtrl', BitcoinServiceAccountsCtrl);

    /** @ngInject */
    function BitcoinServiceAccountsCtrl($scope,$timeout) {
        $scope.bitcoinAccountSettingView = '';

        $scope.goToBitcoinAccountSetting = function (setting) {
            $scope.bitcoinAccountSettingView = setting;
        };
        $timeout(function () {
            $scope.goToBitcoinAccountSetting('hotwallet');
        },200);
    }

})();
