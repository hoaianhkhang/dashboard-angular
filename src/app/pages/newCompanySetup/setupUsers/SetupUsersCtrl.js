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
            $rootScope.userVerified=true;
            $location.path('currency/add/initial');
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
        
        $scope.addUser = function (label) {
            var newGroup = {
                "name": label.toLowerCase().replace(/ /g, "_"),
                "label": label
            };
            $http.post(environmentConfig.API + '/admin/groups/',newGroup, {
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
