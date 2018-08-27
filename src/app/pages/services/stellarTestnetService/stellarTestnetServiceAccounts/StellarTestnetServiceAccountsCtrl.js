(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarTestnetService.stellarTestnetServiceAccounts')
        .controller('StellarTestnetServiceAccountsCtrl', StellarTestnetServiceAccountsCtrl);

    /** @ngInject */
    function StellarTestnetServiceAccountsCtrl($scope,$timeout,$location) {
        $scope.stellarAccountSettingView = '';

        $scope.goToStellarAccountSetting = function (setting) {
            $scope.stellarAccountSettingView = setting;
        };
        $timeout(function () {
            $scope.goToStellarAccountSetting('hotwallet');
        },100);
    }

})();
