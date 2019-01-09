(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.productsService')
        .controller('ProductsServiceCtrl', ProductsServiceCtrl);

    /** @ngInject */
    function ProductsServiceCtrl($scope,$rootScope,localStorageManagement,$location) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.baseUrl = localStorageManagement.getValue('SERVICEURL');
        $rootScope.dashboardTitle = 'Rewards service | Rehive';
        $scope.loadingCampaigns =  false;
        vm.location = $location.path();
        vm.locationArray = vm.location.split('/');
        $scope.locationIndicator = vm.locationArray[vm.locationArray.length - 1];

        $scope.$on('$locationChangeStart', function (event,newUrl) {
            vm.location = $location.path();
            if(vm.location.indexOf('campaigns') > 0){
                $scope.locationIndicator = 'campaigns';
            } else if(vm.location.indexOf('requests') > 0){
                $scope.locationIndicator = 'requests';
            }
            vm.locationTracker(vm.location);
        });

        vm.locationTracker = function (location) {
            var baseLocation = '/services/products/';
            var remainingLocation = location.split(baseLocation).pop();
            var remainingLocationArray = remainingLocation.split('/');

            if(remainingLocationArray[0] == 'list'){
                $scope.trackedLocation = 'list';
                // if(remainingLocationArray[(0)] == 'create'){
                //     $scope.trackedLocation = 'list';
                // } else if(remainingLocationArray[(remainingLocationArray.length - 1)] == 'edit'){
                //     $scope.trackedLocation = 'list';
                // } else {
                //     $scope.secondaryTrackedLocation = '';
                // }
            } else if (remainingLocationArray[0] == 'create'){
                $scope.trackedLocation = 'list';
            } else if (remainingLocationArray[0] == 'settings'){
                $scope.trackedLocation = 'settings';
            }
        };
        vm.locationTracker(vm.location);

        $scope.goToRewardsBreadCrumbsView = function (path) {
            $location.path(path);
        };

    }
})();
