(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groupTiers')
        .controller('GroupTierCtrl', GroupTierCtrl);

    /** @ngInject */
    function GroupTierCtrl($scope,$stateParams,cookieManagement,$location) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
        vm.groupName = $stateParams.groupName;
        $scope.loadingGroups = true;

        $scope.goToGroupTiersSettings = function (path) {
            $location.path('/settings/groups-management/' + vm.groupName + '/tiers/' + path);
        };

        $scope.goBackToGroupSettings = function () {
            $location.path('/settings/groups-management/' + vm.groupName);
        };

    }
})();
