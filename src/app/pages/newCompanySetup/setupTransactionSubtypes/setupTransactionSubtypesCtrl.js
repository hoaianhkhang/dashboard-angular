(function () {
    'use strict';

    angular.module('BlurAdmin.pages.newCompanySetup.setupTransactionSubtypes')
        .controller("SetupTransactionSubtypesCtrl", SetupTransactionSubtypesCtrl);

    function SetupTransactionSubtypesCtrl($rootScope,$scope,$http,toastr,cookieManagement,
        environmentConfig,$location,errorHandler) {
        var vm=this;
        vm.token=cookieManagement.getCookie("TOKEN");
        $scope.subtypes = [];
        $scope.subtype={};
        $rootScope.$pageFinishedLoading=true;
        $rootScope.activeSetupRoute = 3;
        $scope.editingSubtypes = false;

        $scope.goToNextView=function () {
            $location.path('/currencies');
        }
        $scope.goToPrevView=function () {
            $location.path('company/setup/accounts');
        }


        vm.getSubtypes = function(){
            if(vm.token){
                $http.get(environmentConfig.API + '/admin/subtypes/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $scope.subtypes = res.data.data;
                        if($scope.subtypes.length==0){
                            $rootScope.setupSubtypes = 0;
                        }
                        else {
                            $rootScope.setupSubtypes = 1;
                        }
                    }
                }).catch(function (error) {
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        vm.getSubtypes();
        
        $scope.addSubtype = function (subtype) {
            $http.post(environmentConfig.API + '/admin/subtypes/',subtype, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                if (res.status === 201) {
                    $scope.subtype={};
                    vm.getSubtypes();
                }
            }).catch(function (error) {
                $rootScope.$pageFinishedLoading = true;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        }

        $scope.updateSubtype = function (subtype) {
            var newSubtype = {
                tx_type: subtype.tx_type,
                label: subtype.label
            };
            if(subtype.prevName!==subtype.name){
                newSubtype.name = subtype.name;
            }
            $http.patch(environmentConfig.API + '/admin/subtypes/' + subtype.id + '/', newSubtype, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                if (res.status === 200) {
                    $scope.subtype={};
                    $scope.editingSubtypes = false;
                }
            }).catch(function (error) {
                $rootScope.$pageFinishedLoading = true;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        }

        $scope.deleteSelectedItem=function (id) {
            $http.delete(environmentConfig.API + '/admin/subtypes/' + id + '/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                if (res.status === 200) {
                    vm.getSubtypes();
                }
            }).catch(function (error) {
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        }

        $scope.editSubtype = function(subtype) {
            $scope.subtype = subtype;
            $scope.editingSubtypes = true;
            $scope.subtype.prevName = subtype.name;
        }
    }
})();
