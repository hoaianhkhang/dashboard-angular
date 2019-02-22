(function () {
    'use strict';

    angular.module('BlurAdmin.pages.demoSetup')
        .controller("DemoSetupCtrl", DemoSetupCtrl);

    function DemoSetupCtrl($rootScope, $scope, $http, $location,localStorageManagement, environmentConfig,
                           errorHandler, Rehive, toastr) {
        var vm=this;
        vm.token = localStorageManagement.getValue("token");
        $rootScope.dashboardTitle = 'Demo setup | Rehive';
        $rootScope.securityConfigured = false;
        $scope.settingUpDemo = false;
        $rootScope.setupCompany = localStorageManagement.getValue('setupCompany') || 0;
        $rootScope.setupUsers = localStorageManagement.getValue('setupUsers') || 0;
        $rootScope.setupCurrencies = localStorageManagement.getValue('setupCurrencies') || 0;
        $rootScope.setupAccounts = localStorageManagement.getValue('setupAccounts') || 0;
        $rootScope.setupSubtypes = localStorageManagement.getValue('setupSubtypes') || 0;
        $rootScope.activeSetupRoute = localStorageManagement.getValue('activeSetupRoute') || 0;

        vm.configureCompanyDetails = function(){
            var demoCompany = {
                name: "CompanyName",
                description: "CompanyName is a multi cryptocurrencies app for spending online.",
                website: "",
                email: "",
                logo: null,
                icon: null,
                public: false,
                config: {}
            };
            vm.setupUserGroups();
            // if(vm.token){
            //     Rehive.admin.company.update(demoCompany).then(function(res){
            //         console.log(res);
            //         $rootScope.pageTopObj.companyObj = res;
            //         vm.setupUserGroups();
            //         $scope.$apply();
            //     }).catch(function(error){
            //         errorHandler.evaluateErrors(error.data);
            //         errorHandler.handleErrors(error);
            //         $scope.$apply();
            //     });
            // }
        };

        vm.addGroup = function(groupObj, last){
            if(vm.token){
                if(groupObj.name === 'admin'){
                    Rehive.admin.groups.update(groupObj.name, {description: "Admin users have full access to all aspects of the company."})
                        .then(function(res){
                            $scope.$apply();
                        }, function (error) {
                            errorHandler.evaluateErrors(error);
                            errorHandler.handleErrors(error);
                            $scope.$apply();
                        });
                }
                else if(groupObj.name === 'service'){
                    Rehive.admin.groups.update(groupObj.name, {description: "Services have access to specific permissions that’s needed for each service."})
                        .then(function(res){
                            $scope.$apply();
                        }, function (error) {
                            errorHandler.evaluateErrors(error);
                            errorHandler.handleErrors(error);
                            $scope.$apply();
                        });
                }
                else {
                    Rehive.admin.groups.create(groupObj).then(function (res)
                    {
                        Rehive.admin.groups.update(groupObj.name, groupObj)
                            .then(function(res){
                                if(last){
                                    vm.setupGroupTiers();
                                }
                                $scope.$apply();
                            }, function (error) {
                                errorHandler.evaluateErrors(error);
                                errorHandler.handleErrors(error);
                                $scope.$apply();
                            });
                        $scope.$apply();
                    }, function (error) {
                        errorHandler.evaluateErrors(error);
                        errorHandler.handleErrors(error);
                        $scope.$apply();
                    });
                }
            }
        };

        vm.setupUserGroups = function(){
            var userGroup = {
                    name: "user",
                    label: "User",
                    public: true,
                    default: true,
                    description: "Users are limited to their own accounts."
                },
                managerGroup = {
                    name: "manager",
                    label: "Manager",
                    public: false,
                    default: false,
                    description: "Managers have access to make transactions from their own operational account, " +
                        "view and verify user data. Managers do not have access to  system configurations."
                },
                supportGroup = {
                    name: "support",
                    label: "Support",
                    public: false,
                    default: false,
                    description: "Support has limited access to make transactions from their own operational account, " +
                        "view and verify user data. Support do not have access to  system configurations."
                },
                merchantGroup = {
                    name: "merchant",
                    label: "Merchant",
                    public: false,
                    default: false,
                    description: "Merchants are limited to their own accounts."
                };

                vm.addGroup(userGroup, null);
                vm.addGroup(managerGroup, null);
                vm.addGroup(supportGroup, null);
                vm.addGroup(merchantGroup, 'last');
        };

        vm.addGroupTiers = function(groupName, tierObj, last){
            if(vm.token) {
                Rehive.admin.groups.tiers.create(groupName, tierObj).then(function (res) {
                    if(last){
                        vm.getAllTiers();
                    }
                    $scope.$apply();
                }, function (error) {
                    $scope.addingTiers = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        vm.setupGroupTiers = function(){
            var userTier1 = {
                level: 1,
                name: "1",
                description: "Basic"
            },
            userTier2 = {
                level: 2,
                name: "2",
                description: "Intermediary"
            },
            merchantTier1 = {
                "level": 1,
                "name": "1",
                "description": "Basic"
            },
            merchantTier2 = {
                "level": 2,
                "name": "2",
                "description": "Intermediary"
            }
            vm.addGroupTiers("user", userTier1, null);
            vm.addGroupTiers("user", userTier2, null);
            vm.addGroupTiers("merchant", merchantTier1, null);
            vm.addGroupTiers("merchant", merchantTier2, "last");
        };

        vm.getAllTiers = function(){
            var userGroupTiers = [];
            var merchantGroupTiers = [];
            Rehive.admin.groups.tiers.get("user").then(function (res) {
                userGroupTiers = res;
                $scope.$apply();
            }, function (error) {
                $scope.loadingTierRequirements = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
            Rehive.admin.groups.tiers.get("merchant").then(function (res) {
                userGroupTiers = res;
                $scope.$apply();
            }, function (error) {
                $scope.loadingTierRequirements = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

        vm.updateTierRequirements = function(groupName, tierObj, requirementObj, last){

        };

        vm.setupServices = function(){
            console.log("Here...");
            $scope.settingUpDemo = false;
            $rootScope.securityConfigured = true;
            $location.path('/currencies');
        };

        $scope.initializeDemoSetup = function(){
            $scope.settingUpDemo = true;
            vm.configureCompanyDetails();
        };

        $scope.goToView = function(path){
            $location.path(path);
        };

        $rootScope.skipAllView=function () {
            $location.path('/currencies');
        };

    }
})();
