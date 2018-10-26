(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services')
        .controller('ServicesCtrl', ServicesCtrl);

    /** @ngInject */
    function ServicesCtrl($rootScope,$scope,$location,$http,environmentConfig,localStorageManagement,
                          errorHandler,$ngConfirm,$timeout,toastr,$uibModal,$window) {

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

        $scope.deactivateServicePrompt = function(selectedService) {
            $ngConfirm({
                title: 'Deactivate service',
                contentUrl: 'app/pages/services/deactivateServicePrompt.html',
                animationBounce: 1,
                animationSpeed: 100,
                scope: $scope,
                buttons: {
                    close: {
                        text: "Cancel",
                        btnClass: 'btn-default dashboard-btn'
                    },
                    Add: {
                        text: "Deactivate",
                        btnClass: 'btn-danger dashboard-btn',
                        keys: ['enter'], // will trigger when enter is pressed
                        action: function(scope){
                            if(!scope.password){
                                toastr.error('Please enter your password');
                                return;
                            }
                            scope.deactivateServices(selectedService,scope.password);
                        }
                    }
                }
            });
        };

        $scope.deactivateServices = function(service,password){
            $scope.loadingServices = true;
            $http.put(environmentConfig.API + '/admin/services/' + service.id + '/',{password: password,active: false}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                if (res.status === 200) {
                    $timeout(function () {
                        $scope.loadingServices = false;
                        toastr.success('Service has been successfully deactivated');
                        $scope.getServices();
                    },600);
                }
            }).catch(function (error) {
                $scope.loadingServices = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        $scope.goToService = function($event,service) {
            var serviceName,serviceNameArray;

            localStorageManagement.setValue('SERVICEURL',service.url);
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
