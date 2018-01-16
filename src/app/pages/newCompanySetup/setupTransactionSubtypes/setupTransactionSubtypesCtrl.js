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

        $scope.goToNextView=function () {
            $rootScope.userVerified=true;
            $location.path('/currencies');
        }
        $scope.goToPrevView=function () {
            $rootScope.userVerified=true;
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
                        console.log($scope.subtypes);
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
    }
})();
