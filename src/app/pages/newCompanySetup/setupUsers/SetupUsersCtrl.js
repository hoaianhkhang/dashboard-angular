(function () {
    'use strict';

    angular.module('BlurAdmin.pages.newCompanySetup.setupUsers')
        .controller("SetupUsersCtrl", SetupUsersCtrl);

    function SetupUsersCtrl($rootScope,$scope,$http,toastr,cookieManagement,currenciesList,
        environmentConfig,$location,errorHandler) {
        var vm=this;
        vm.token=cookieManagement.getCookie("TOKEN");
        $scope.addedGroups = [];
        $scope.name="";
        $rootScope.$pageFinishedLoading=true;

        $scope.goToNextView=function () {
            $rootScope.userFullyVerified = true;
            $location.path('company/setup/currencysetup');
        }

        vm.getGroups = function(){
            if(vm.token){
                $http.get(environmentConfig.API + '/admin/groups/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $scope.addedGroups = res.data.data.results;
                    }
                }).catch(function (error) {
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        vm.getGroups();
        
        $scope.addUser = function (group) {
            $http.post(environmentConfig.API + '/admin/groups/',group, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                if (res.status === 201) {
                    $scope.name="";
                    vm.getGroups();
                }
            }).catch(function (error) {
                $rootScope.$pageFinishedLoading = true;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        }
    }
})();
