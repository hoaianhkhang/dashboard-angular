(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarService.stellarServiceAccounts')
        .controller('StellarServiceAccountsCtrl', StellarServiceAccountsCtrl);

    /** @ngInject */
    function StellarServiceAccountsCtrl($scope,$timeout,$location) {
        $scope.stellarAccountSettingView = '';

        $scope.goToStellarAccountSetting = function (setting) {
            $scope.stellarAccountSettingView = setting;
        };
        $timeout(function () {
            $scope.goToStellarAccountSetting('hotwallet');
        },100);
    }

})();
