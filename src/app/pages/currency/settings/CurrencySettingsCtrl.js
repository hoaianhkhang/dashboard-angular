(function () {
    'use strict';

    angular.module('BlurAdmin.pages.currency.settings')
        .controller('CurrencySettingsCtrl', CurrencySettingsCtrl);

    /** @ngInject */
    function CurrencySettingsCtrl($scope,$location,$stateParams) {

        var vm = this;
        $scope.currencyCode = $stateParams.currencyCode;
        vm.location = $location.path();
        vm.locationArray = vm.location.split('/');
        $scope.locationIndicator = vm.locationArray[vm.locationArray.length - 1];

        $scope.goToCurrencySetting = function(settingPath){
            $location.path(settingPath);
        };

    }
})();
