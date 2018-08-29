(function () {
    'use strict';

    angular.module('BlurAdmin.pages.newCompanySetup.setupAccounts')
        .controller("SetupAccountsCtrl", SetupAccountsCtrl);

    function SetupAccountsCtrl($rootScope,$scope,toastr,localStorageManagement,$ngConfirm,
                               Rehive,$location,errorHandler,$filter) {

        var vm = this;
        vm.token = localStorageManagement.getValue("token");
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

        $scope.accountConfigNameChanged = function (account) {
            if(account.name){
                account.name = account.name.toLowerCase();
                account.label = $filter('capitalizeWord')(account.name).replace(/_/g, " ").replace(/-/g, " ");
            } else {
                account.label = '';
            }
        };

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
                Rehive.admin.groups.get().then(function (res) {
                    res.results.forEach(function (element) {
                        if(element.name !== 'admin' && element.name !== 'service'){
                            $scope.groups.push(element);
                        }
                    });

                    vm.getAccountConfigurations();
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingCompanySetupAccounts = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            } else {
                $rootScope.gotToken = false;
                $rootScope.securityConfigured = true;
                $rootScope.pageTopObj = {};
                localStorageManagement.deleteValue('TOKEN');
                localStorageManagement.deleteValue('token');
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
                        Rehive.admin.groups.accountConfigurations.get(element.name).then(function (res) {
                            element.accConfigCount = res.count;
                            res.results.forEach(function(node){
                                node.group = element;
                            });
                            $scope.accounts = $scope.accounts.concat(res.results);
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
                            $scope.$apply();
                        }, function (error) {
                            $scope.loadingCompanySetupAccounts = false;
                            errorHandler.evaluateErrors(error);
                            errorHandler.handleErrors(error);
                            $scope.$apply();
                        });
                    });
                } else {
                    $scope.loadingCompanySetupAccounts = false;
                }
            }
        };

        vm.getCurrencies = function(){
            if(vm.token){
                Rehive.admin.currencies.get({filters: {
                    archived: false,
                    page_size: 250
                }}).then(function (res) {
                    $scope.currencies = res.results;
                    $scope.$apply();
                }, function (error) {
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
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

            Rehive.admin.groups.accountConfigurations.create(account.groupName.name, newaccount).then(function (res)
            {
                res.group = account.groupName;
                $scope.accounts.push(res);
                if($scope.accounts.length==0) {
                    $rootScope.setupAccounts = 0;
                    localStorageManagement.setValue('setupAccounts',0);
                } else {
                    $rootScope.setupAccounts = 1;
                    localStorageManagement.setValue('setupAccounts',1);
                }
                vm.addCurrenciesToAccount(account);
                $scope.$apply();
            }, function (error) {
                $rootScope.$pageFinishedLoading = true;
                $scope.loadingCompanySetupAccounts = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
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

            Rehive.admin.groups.accountConfigurations.update(account.groupName.name,account.prevName,newaccount).then(function (res)
            {
                vm.initializeAccount();
                $scope.editingAccount = false;
                toastr.success('Account configuration updated');
                res.group = account.groupName;
                if($scope.accounts.length==0) {
                    $rootScope.setupAccounts = 0;
                    localStorageManagement.setValue('setupAccounts',0);
                } else {
                    $rootScope.setupAccounts = 1;
                    localStorageManagement.setValue('setupAccounts',1);
                }
                vm.addCurrenciesToAccount(account);
                $scope.$apply();
            }, function (error) {
                $scope.loadingCompanySetupAccounts = false;
                $rootScope.$pageFinishedLoading = true;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

        vm.addCurrenciesToAccount = function (account) {
            $scope.loadingCompanySetupAccounts = true;
            if(account.currencies.length > 0){
                account.currencies.forEach(function(element,i,array) {
                    Rehive.admin.groups.accountConfigurations.currencies.create(account.groupName.name,account.name,
                    {
                        currency: element.code
                    }).then(function (res) {
                        if(i == (array.length - 1)){
                            $scope.alreadySelectedCurrencies = [];
                            vm.getGroups();
                            $scope.$apply();
                        }
                    }, function (error) {
                        $scope.loadingCompanySetupAccounts = false;
                        $rootScope.$pageFinishedLoading = true;
                        errorHandler.evaluateErrors(error);
                        errorHandler.handleErrors(error);
                        $scope.$apply();
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
            Rehive.admin.groups.accountConfigurations.delete(account.group.name,account.name).then(function (res) {
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
                $scope.$apply();
            }, function (error) {
                $scope.loadingCompanySetupAccounts = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
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
