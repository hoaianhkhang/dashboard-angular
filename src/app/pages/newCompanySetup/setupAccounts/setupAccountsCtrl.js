(function () {
    'use strict';

    angular.module('BlurAdmin.pages.newCompanySetup.setupAccounts')
        .controller("SetupAccountsCtrl", SetupAccountsCtrl);

    function SetupAccountsCtrl($rootScope,$scope,$http,toastr,cookieManagement,currenciesList,$ngConfirm,
        environmentConfig,$location,errorHandler,localStorageManagement) {

        var vm = this;
        vm.token=cookieManagement.getCookie("TOKEN");
        $scope.groups = [];
        $scope.currencies = [];        
        $rootScope.$pageFinishedLoading=true;
        $scope.account = {};
        $scope.accounts = [];
        $scope.editingAccount= false;
        $scope.showAccountConfigsOfGroup = -1;
        $rootScope.activeSetupRoute = 2;
        localStorageManagement.setValue('activeSetupRoute',2);
        $scope.loadingCompanySetupAccounts = true;

        $scope.showAccountConfigs = function (index) {
            if($scope.showAccountConfigsOfGroup == index){
                $scope.showAccountConfigsOfGroup = -1;
            } else {
                $scope.showAccountConfigsOfGroup = index;
            }
        };

        $scope.goToNextView=function () {
            $location.path('/company/setup/subtypes');
        };
        $scope.goToPrevView=function () {
            $location.path('/company/setup/currency-setup');
        };
        
        vm.initializeAccount = function () {
            $scope.account = {
                currencies: [],
                groupName: {},
                name: "",
                label: "",
                primary: false,
                default: false
            };
        };
        vm.initializeAccount();

        vm.getGroups = function(){
            vm.initializeAccount();
            $scope.groups = [];
            $scope.accounts = [];
            if(vm.token){
                $scope.loadingCompanySetupAccounts = true;
                $http.get(environmentConfig.API + '/admin/groups/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        res.data.data.results.forEach(function (element) {
                            if(element.name !== 'admin' && element.name !== 'service'){
                                $scope.groups.push(element);
                            }
                        });

                        vm.getAccountConfigurations();

                    }
                }).catch(function (error) {
                    $scope.loadingCompanySetupAccounts = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            } else {
                $rootScope.gotToken = false;
                $rootScope.securityConfigured = true;
                $rootScope.pageTopObj = {};
                $rootScope.userFullyVerified = false;
                cookieManagement.deleteCookie('TOKEN');
                toastr.error('Your session has expired, please log in again');
                $location.path('/login');
            }
        };
        vm.getGroups();

        vm.getAccountConfigurations = function(){
            if(vm.token){
                $scope.loadingCompanySetupAccounts = true;
                if($scope.groups.length > 0){
                    $scope.groups.forEach(function (element,ind,array) {
                        $http.get(environmentConfig.API + '/admin/groups/'+ element.name +"/account-configurations/", {
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': vm.token
                            }
                        }).then(function (res) {
                            if (res.status === 200) {
                                element.accConfigCount = res.data.data.count;
                                res.data.data.results.forEach(function(node){
                                    node.group = element;
                                });
                                $scope.accounts = $scope.accounts.concat(res.data.data.results);
                                if($scope.accounts.length == 0) {
                                    $rootScope.setupAccounts = 0;
                                    localStorageManagement.setValue('setupAccounts',0);
                                } else {
                                    $rootScope.setupAccounts = 1;
                                    localStorageManagement.setValue('setupAccounts',1);
                                }

                                if(ind == (array.length - 1)){
                                    $scope.loadingCompanySetupAccounts = false;
                                }
                            }
                        }).catch(function (error) {
                            $scope.loadingCompanySetupAccounts = false;
                            errorHandler.evaluateErrors(error.data);
                            errorHandler.handleErrors(error);
                        });
                    });
                } else {
                    $scope.loadingCompanySetupAccounts = false;
                }
            }
        };

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
            $scope.loadingCompanySetupAccounts = true;
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
                    res.data.data.group = account.groupName;
                    $scope.accounts.push(res.data.data);
                    if($scope.accounts.length==0) {
                        $rootScope.setupAccounts = 0;
                        localStorageManagement.setValue('setupAccounts',0);
                    } else {
                        $rootScope.setupAccounts = 1;
                        localStorageManagement.setValue('setupAccounts',1);
                    }
                    vm.addCurrenciesToAccount(account);
                }
            }).catch(function (error) {
                $rootScope.$pageFinishedLoading = true;
                $scope.loadingCompanySetupAccounts = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        $scope.editAccountCompanySetup = function (account) {
            $scope.loadingCompanySetupAccounts = true;
            var newaccount = {
                "name": account.name,
                "label": account.label,
                "primary": account.primary,
                "default": account.default
            };
            $http.patch(environmentConfig.API + '/admin/groups/'+ account.groupName.name +"/account-configurations/" + account.prevName + "/", newaccount, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                if (res.status === 200) {
                    vm.initializeAccount();
                    $scope.editingAccount = false;
                    toastr.success('Account configuration updated');
                    res.data.data.group = account.groupName;
                    if($scope.accounts.length==0) {
                        $rootScope.setupAccounts = 0;
                        localStorageManagement.setValue('setupAccounts',0);
                    } else {
                        $rootScope.setupAccounts = 1;
                        localStorageManagement.setValue('setupAccounts',1);
                    }
                    vm.addCurrenciesToAccount(account);
                }
            }).catch(function (error) {
                $scope.loadingCompanySetupAccounts = false;
                $rootScope.$pageFinishedLoading = true;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        vm.addCurrenciesToAccount = function (account) {
            $scope.loadingCompanySetupAccounts = true;
            if(account.currencies.length > 0){
                account.currencies.forEach(function(element,i,array) {
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
                            if(i == (array.length - 1)){
                                $scope.alreadySelectedCurrencies = [];
                                vm.getGroups();
                            }
                        }
                    }).catch(function (error) {
                        $scope.loadingCompanySetupAccounts = false;
                        $rootScope.$pageFinishedLoading = true;
                        errorHandler.evaluateErrors(error.data);
                        errorHandler.handleErrors(error);
                    });
                });
            } else {
                vm.getGroups();
                account.currencies = $scope.alreadySelectedCurrencies;
                $scope.alreadySelectedCurrencies = [];
            }
        };

        $scope.deleteAccountConfirm = function (account) {
            $ngConfirm({
                title: 'Delete account configuration',
                content: 'Are you sure you want to delete this account configuration?',
                animationBounce: 1,
                animationSpeed: 100,
                scope: $scope,
                buttons: {
                    close: {
                        text: "No",
                        btnClass: 'btn-default pull-left dashboard-btn'
                    },
                    ok: {
                        text: "Yes",
                        btnClass: 'btn-primary dashboard-btn',
                        keys: ['enter'], // will trigger when enter is pressed
                        action: function(scope){
                            $scope.deleteAccount(account);
                        }
                    }
                }
            });
        };

        $scope.deleteAccount = function (account) {
            $scope.loadingCompanySetupAccounts = true;
            $http.delete(environmentConfig.API + '/admin/groups/'+ account.group.name +"/account-configurations/" + account.name + "/", {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                if (res.status === 200) {
                    $scope.alreadySelectedCurrencies = [];
                    var index = $scope.accounts.indexOf(account);
                    $scope.accounts.splice(index,1);
                    if($scope.accounts.length==0) {
                        $rootScope.setupAccounts = 0;
                        localStorageManagement.setValue('setupAccounts',0);
                    } else {
                        $rootScope.setupAccounts = 1;
                        localStorageManagement.setValue('setupAccounts',1);
                    }
                    vm.getGroups();
                }
            }).catch(function (error) {
                $scope.loadingCompanySetupAccounts = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        $scope.editingAccountCompanySetup = function (account) {
            if($scope.account.group && ($scope.account.name != account.name) && ($scope.account.group.name != account.group.name)){
                $scope.account.currencies = $scope.alreadySelectedCurrencies;
                $scope.editingAccount = true;
                $scope.account = account;
                $scope.alreadySelectedCurrencies = account.currencies;
                $scope.account.prevName = account.name;
                $scope.account.groupName = account.group;
                $scope.account.currencies = [];
            } else {
                $scope.account.currencies = $scope.alreadySelectedCurrencies;
                $scope.editingAccount = true;
                $scope.account = account;
                $scope.alreadySelectedCurrencies = account.currencies;
                $scope.account.prevName = account.name;
                $scope.account.groupName = account.group;
                $scope.account.currencies = [];
            }
        };
    }
})();
