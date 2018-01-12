(function () {
    'use strict';

    angular.module('BlurAdmin.pages.newCompanySetup.setupAccounts')
        .controller("SetupAccountsCtrl", SetupAccountsCtrl);

    function SetupAccountsCtrl($rootScope,$scope,$http,toastr,cookieManagement,currenciesList,
        environmentConfig,$location,errorHandler) {
        var vm=this;
        vm.token=cookieManagement.getCookie("TOKEN");
        $scope.groups = [];
        $scope.currencies = [];        
        $rootScope.$pageFinishedLoading=true;
        $scope.account = {};
        $scope.accounts = [];

        $scope.goToNextView=function () {
            $rootScope.userVerified=true;
            $location.path('/currencies');
        }
        $scope.goToPrevView=function () {
            $rootScope.userVerified=true;
            $location.path('/company/setup/currencies');
        }
        
        vm.initializeAccount = function () {
            $scope.account = {
                currencies: [],
                groupName: {},
                name: "",
                label: "",
                primary: false,
                default: false
            };
        }
        vm.initializeAccount();

        vm.getGroups = function(){
            if(vm.token){
                $http.get(environmentConfig.API + '/admin/groups/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $scope.groups = res.data.data.results;
                        $scope.groups.forEach(element => {
                            $http.get(environmentConfig.API + '/admin/groups/'+ element.name +"/account-configurations/", {
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': vm.token
                                }
                            }).then(function (res) {
                                if (res.status === 200) {
                                    $scope.accounts = $scope.accounts.concat(res.data.data.results);
                                    console.log($scope.accounts);
                                }
                            }).catch(function (error) {
                                errorHandler.evaluateErrors(error.data);
                                errorHandler.handleErrors(error);
                            });
                        });
                    }
                }).catch(function (error) {
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        vm.getGroups();

        vm.getCurrencies = function(){
            if(vm.token){
                $http.get(environmentConfig.API + '/admin/currencies/?enabled=true&page_size=250', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $scope.currencies = res.data.data.results;
                    }
                }).catch(function (error) {
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        vm.getCurrencies();
        
        $scope.addAccount = function (account) {
            console.log(account);
            var newaccount = {
                "name": account.name,
                "label": account.label,
                "primary": account.primary,
                "default": account.default
            };
            $http.post(environmentConfig.API + '/admin/groups/'+ account.groupName.name +"/account-configurations/", newaccount, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                if (res.status === 201) {
                    vm.initializeAccount();
                    $scope.accounts.push(res.data.data);
                    account.currencies.forEach(element => {
                        $http.post(environmentConfig.API + '/admin/groups/'+ account.groupName.name +"/account-configurations/"+account.name+"/currencies/", 
                        {
                            "currency": element.code
                        },
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': vm.token
                            }
                        }).then(function (res) {
                            if (res.status === 201) {
                                
                            }
                        }).catch(function (error) {
                            $rootScope.$pageFinishedLoading = true;
                            errorHandler.evaluateErrors(error.data);
                            errorHandler.handleErrors(error);
                        });
                    })
                }
            }).catch(function (error) {
                $rootScope.$pageFinishedLoading = true;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        }
    }
})();
