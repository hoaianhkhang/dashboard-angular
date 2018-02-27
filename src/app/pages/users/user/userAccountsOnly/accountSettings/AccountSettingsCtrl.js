(function () {
    'use strict';

    angular.module('BlurAdmin.pages.accountSettings')
        .controller('AccountSettingsCtrl', AccountSettingsCtrl);

    /** @ngInject */
    function AccountSettingsCtrl($scope,cookieManagement,$stateParams,$location) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
        $scope.reference = $stateParams.reference;
        $scope.currencyCode = $stateParams.currencyCode;
        vm.uuid = $stateParams.uuid;
        $scope.settingView = 'controls';

        $scope.goToSetting = function(path){
            $location.path('user/' + vm.uuid + '/account/'+ $scope.reference +'/settings/' + $scope.currencyCode + '/' + path);
        };

        $scope.goBackToUser = function () {
            $location.path('user/' + vm.uuid + '/accounts');
        };

    }
})();
