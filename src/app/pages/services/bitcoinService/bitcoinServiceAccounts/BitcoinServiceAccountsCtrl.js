(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.bitcoinService.bitcoinServiceAccounts')
        .controller('BitcoinServiceAccountsCtrl', BitcoinServiceAccountsCtrl);

    /** @ngInject */
    function BitcoinServiceAccountsCtrl($scope) {
        $scope.bitcoinAccountSettingView = '';

        $scope.goToBitcoinAccountSetting = function (setting) {
            $scope.bitcoinAccountSettingView = setting;
        };
    }

})();
