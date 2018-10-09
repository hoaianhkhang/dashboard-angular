(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.bitcoinService')
        .directive('bitcoinServiceNavigation', bitcoinServiceNavigation);

    /** @ngInject */
    function bitcoinServiceNavigation() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/services/bitcoinService/bitcoinServiceNavigation/bitcoinServiceNavigation.html',
            controller: function($rootScope,$scope,$location,localStorageManagement){
                var location = $location.path();
                var locationArray = location.split('/');
                $scope.locationIndicator = locationArray[(locationArray.length -1)];
                var serviceUrl = localStorageManagement.getValue('SERVICEURL');
                if(serviceUrl.indexOf('bitcoin-testnet') > 0){
                    $scope.inTestnetService = true;
                } else {
                    $scope.inTestnetService = false;
                }
            }
        };
    }
})();
