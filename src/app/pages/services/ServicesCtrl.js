(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services')
        .controller('ServicesCtrl', ServicesCtrl);

    /** @ngInject */
    function ServicesCtrl($rootScope,$scope,$location,$http,environmentConfig,localStorageManagement,
                          errorHandler,$uibModal,$window) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        $rootScope.dashboardTitle = 'Services | Rehive';
        $scope.loadingServices = true;
        $scope.showingFilters = false;

        $scope.showFilters = function () {
            $scope.showingFilters = !$scope.showingFilters;
        };

        $scope.closeOptionsBox = function () {
            $scope.optionsCode = '';
        };

        $scope.getServices = function(){
          $scope.loadingServices = true;
            $http.get(environmentConfig.API + '/admin/services/?active=true', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
              $scope.loadingServices = false;
                if (res.status === 200) {
                  $scope.servicesList =  res.data.data.results;
                }
            }).catch(function (error) {
              $scope.loadingServices = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };
        $scope.getServices();

        $scope.goToService = function($event,service) {
            var serviceName,serviceNameArray;

            localStorageManagement.setValue('SERVICEURL',service.url);
            localStorageManagement.setValue('SERVICEID',service.id);
            var indexOfServiceWord = service.name.search('Service');
            if(indexOfServiceWord > 0){
                serviceName = service.name.substring(0,indexOfServiceWord);
                serviceNameArray = serviceName.trim().split(' ');
                if(serviceNameArray.length > 1){
                    serviceName = serviceNameArray.join('-');
                } else {
                    serviceName = serviceNameArray.toString();
                }
            } else {
                serviceName = service.name;
            }
            var pathName = serviceName.toLowerCase().trim();

            if($event.which === 1){
                $location.path('/services/' + pathName);
            } else if($event.which === 2){
                $window.open('/#/services/' + pathName,'_blank');
            } else if($event.which === 3){
                $window.open('/#/services/' + pathName,'_blank');
            }
        };

        $scope.openAddServicesModal = function (page, size) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'AddServiceModalCtrl',
                scope: $scope
            });

            vm.theModal.result.then(function(service){
                if(service){
                    $scope.getServices();
                }
            }, function(){
            });
        };
    }
})();
