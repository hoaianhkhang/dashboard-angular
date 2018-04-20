(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.addService')
        .controller('AddServiceCtrl', AddServiceCtrl);

    /** @ngInject */
    function AddServiceCtrl($scope,$location,$http,environmentConfig,errorHandler,toastr,localStorageManagement,$ngConfirm,$timeout) {

        $scope.selectedService = {};
        $scope.loadingServices = true;

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');

        $scope.getServices = function(){
            $scope.loadingServices = true;
            $http.get(environmentConfig.API + '/admin/services/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.loadingServices = false;
                if (res.status === 200) {
                    $scope.selectedService.selected =  res.data.data.results[0];
                    $scope.serviceListOptions =  res.data.data.results;
                }
            }).catch(function (error) {
                $scope.loadingServices = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };
        $scope.getServices();

        $scope.addServicePrompt = function(selectedService) {
            $ngConfirm({
                title: 'Add service',
                contentUrl: 'app/pages/services/addService/addServicePrompt.html',
                animationBounce: 1,
                animationSpeed: 100,
                scope: $scope,
                buttons: {
                    close: {
                        text: "Cancel",
                        btnClass: 'btn-default dashboard-btn'
                    },
                    Add: {
                        text: "Add",
                        keys: ['enter'], // will trigger when enter is pressed
                        btnClass: 'btn-primary dashboard-btn',
                        action: function(scope){
                            if(!scope.password){
                                toastr.error('Please enter your password');
                                return;
                            }
                            scope.addServices(selectedService.selected,scope.password);
                        }
                    }
                }
            });
        };

        $scope.addServices = function(service,password){
            $scope.loadingServices = true;
            $http.put(environmentConfig.API + '/admin/services/' + service.id + '/',{password: password, terms_and_conditions: true, active: true}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                if (res.status === 200) {
                    $timeout(function () {
                        $scope.loadingServices = false;
                        toastr.success('Service has been successfully added');
                        $location.path('/services');
                    },600);
                }
            }).catch(function (error) {
                $scope.loadingServices = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        $scope.goToServices = function(){
            $location.path('/services');
        }

    }
})();
