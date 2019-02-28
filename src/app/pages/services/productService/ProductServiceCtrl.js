(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.productService')
        .controller('ProductServiceCtrl', ProductServiceCtrl);

    /** @ngInject */
    function ProductServiceCtrl($scope,$rootScope,localStorageManagement,$location) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        // vm.baseUrl = localStorageManagement.getValue('SERVICEURL');
        vm.baseUrl = "https://product.services.rehive.io/api/";
        $rootScope.dashboardTitle = 'Products service | Rehive';
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
            var baseLocation = '/services/product/';
            var remainingLocation = location.split(baseLocation).pop();

            if(remainingLocation.indexOf('settings') != -1){
                $scope.trackedLocation = 'settings';
            } else if (remainingLocation.indexOf('orders') != -1){
                $scope.trackedLocation = 'orders';
            } else if (remainingLocation.indexOf('order/create') != -1){
                $scope.trackedLocation = 'orders';
            } else if (remainingLocation.indexOf('order/edit') != -1){
                $scope.trackedLocation = 'orders';
            } else if(remainingLocation.indexOf('list') != -1){
                $scope.trackedLocation = 'list';
            } else if (remainingLocation.indexOf('create') != -1){
                $scope.trackedLocation = 'list';
            } else if (remainingLocation.indexOf('edit') != -1){
                $scope.trackedLocation = 'list';
            }
        };
        vm.locationTracker(vm.location);

        $scope.goToRewardsBreadCrumbsView = function (path) {
            $location.path(path);
        };

    }
})();
