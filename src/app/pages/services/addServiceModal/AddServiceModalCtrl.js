(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services')
        .controller('AddServiceModalCtrl', AddServiceModalCtrl);

    /** @ngInject */
    function AddServiceModalCtrl($scope,$http,environmentConfig,errorHandler,
                                 $uibModalInstance,toastr,localStorageManagement,$ngConfirm,$timeout) {

        $scope.selectedServices = [];
        $scope.loadingServices = true;

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');

        $scope.getActiveServices = function(){
            $scope.loadingServices = true;
            $http.get(environmentConfig.API + '/admin/services/?active=true', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                if (res.status === 200) {
                    $scope.getAllServices(res.data.data.results);
                }
            }).catch(function (error) {
                $scope.loadingServices = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };
        $scope.getActiveServices();

        $scope.getAllServices = function(activeServices){
            $scope.loadingServices = true;
            $http.get(environmentConfig.API + '/admin/services/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.loadingServices = false;
                if (res.status === 200) {
                    activeServices.forEach(function (service) {
                        res.data.data.results.forEach(function (serv,ind,arr) {
                            if(service.id == serv.id){
                                res.data.data.results.splice(ind,1);
                            }
                        });
                    });
                    $scope.serviceListOptions =  res.data.data.results;
                }
            }).catch(function (error) {
                $scope.loadingServices = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        $scope.addServicePrompt = function() {
            $ngConfirm({
                title: 'Add service',
                contentUrl: 'app/pages/services/addServiceModal/addServicePrompt.html',
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
                            scope.addServices(scope.password);
                        }
                    }
                }
            });
        };

        $scope.addServices = function(password){
            $scope.loadingServices = true;
            if($scope.selectedServices.length > 0) {
                $scope.selectedServices.forEach(function (service,index,array) {
                    $http.put(environmentConfig.API + '/admin/services/' + service.id + '/',{password: password, terms_and_conditions: true, active: true}, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': vm.token
                        }
                    }).then(function (res) {
                        if (res.status === 200) {
                            if(index == (array.length - 1)){
                                $timeout(function () {
                                    $scope.loadingServices = false;
                                    toastr.success('Services have been successfully added');
                                    $uibModalInstance.close(true);
                                },600);
                            }
                        }
                    }).catch(function (error) {
                        $scope.loadingServices = false;
                        errorHandler.evaluateErrors(error.data);
                        errorHandler.handleErrors(error);
                    });
                });
            }
        };

    }
})();
