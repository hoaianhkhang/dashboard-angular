(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.notificationService.notificationServiceSettings')
        .controller('NotificationServiceSettingsCtrl', NotificationServiceSettingsCtrl);

    /** @ngInject */
    function NotificationServiceSettingsCtrl(environmentConfig,$rootScope,$scope,$http,$ngConfirm,$timeout,$location,
                                             localStorageManagement,toastr,errorHandler,$state,$uibModal) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        // vm.baseUrl = localStorageManagement.getValue('SERVICEURL');
        vm.baseUrl = "https://notification.services.rehive.io/api/";
        // vm.serviceId = localStorageManagement.getValue('SERVICEID');
        vm.serviceId = 4;
        vm.webhookUrl = "https://notification.services.rehive.io/api/admin/webhook/";
        // $rootScope.dashboardTitle = 'Notification service | Rehive';
        $rootScope.dashboardTitle = 'Notification extension | Rehive';
        $scope.notificationSettingView = '';
        $scope.updatingCompanyDetails =  false;
        vm.updatedCompany = {};
        $scope.company = {};
        $scope.twilioCredsList = [];
        $scope.sendGridCredsList = [];
        $scope.changedCompanyInfo = false;
        vm.prevCompanyName = "";
        vm.prevCompanyEmail = "";

        $scope.goToNotificationSetting = function (setting) {
            $scope.notificationSettingView = setting;
        };
        $scope.goToNotificationSetting('companyDetails');

        vm.getCompanyDetails = function () {
            $scope.updatingCompanyDetails =  true;
            if(vm.token) {
                $http.get(vm.baseUrl + 'admin/company/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.updatingCompanyDetails =  false;
                    if (res.status === 200) {
                        $scope.company = res.data.data;
                        $scope.prevCompanyName = $scope.company.name;
                        $scope.prevCompanyEmail = $scope.company.email;
                    }
                }).catch(function (error) {
                    $scope.updatingCompanyDetails =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        vm.getCompanyDetails();

        $scope.companyDetailsChanged = function (field) {
            $scope.changedCompanyInfo = (vm.prevCompanyName !== $scope.company.name || vm.prevCompanyEmail !== $scope.company.email);
            vm.updatedCompany[field] = $scope.company[field];
        };

        $scope.updateCompanyDetails = function () {
            $scope.updatingCompanyDetails =  true;
            $scope.company = {};
            if(vm.token) {
                $http.patch(vm.baseUrl + 'admin/company/', vm.updatedCompany, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.updatingCompanyDetails =  false;
                    if (res.status === 200) {
                        toastr.success('Company details have been successfully updated');
                        $scope.company = res.data.data;
                    }
                }).catch(function (error) {
                    $scope.updatingCompanyDetails =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.deactivateServiceConfirm = function () {
            $ngConfirm({
                // title: 'Deactivate service',
                title: 'Deactivate extension',
                contentUrl: 'app/pages/services/notificationService/notificationServiceSettings/notificationDeactivation/deactivateNotificationPrompt.html',
                animationBounce: 1,
                animationSpeed: 100,
                scope: $scope,
                buttons: {
                    Add: {
                        text: "Deactivate",
                        btnClass: 'btn-default dashboard-btn',
                        keys: ['enter'], // will trigger when enter is pressed
                        action: function(scope){
                            scope.deactivateService(scope.password);
                        }
                    },
                    close: {
                        text: "Cancel",
                        btnClass: 'btn-primary dashboard-btn'
                    }
                }
            });
        };

        $scope.deactivateService = function (password) {
            if(vm.token) {
                $scope.updatingCompanyDetails = true;
                $http.put(environmentConfig.API + '/admin/services/' + vm.serviceId + '/',{password: password,active: false}, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $timeout(function () {
                            $scope.updatingCompanyDetails = false;
                            toastr.success('Extension has been successfully deactivated');
                            // toastr.success('Service has been successfully deactivated');
                            // $location.path('/services');
                            $location.path('/extensions');
                        },600);
                    }
                }).catch(function (error) {
                    $scope.updatingCompanyDetails = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.goToGeneralWebhooks = function(secret){
            $state.go('developers.webhooks.list',{"secret": secret,"from": "Notifications"});
        };

        //twilio credentials

        vm.getTwilioCredentials = function () {
            $scope.updatingCompanyDetails = true;
            if(vm.token) {
                $http.get(vm.baseUrl + 'admin/credentials/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $scope.updatingCompanyDetails = false;
                        res.data.data.results.forEach(function (creds) {
                            if(creds.credential_type === 'twilio'){
                                $scope.twilioCredsList = [creds];
                            }
                        });
                    }
                }).catch(function (error) {
                    $scope.updatingCompanyDetails =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        vm.getTwilioCredentials();

        $scope.deleteTwilioCredsPrompt = function (twilioCreds) {
            $ngConfirm({
                title: 'Delete twilio credentials',
                content: 'Are you sure you want to delete the twilio credentials?',
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
                            vm.deleteTwilioCreds(twilioCreds);
                        }
                    }
                }
            });
        };

        vm.deleteTwilioCreds = function (twilioCreds) {
            $scope.updatingCompanyDetails = true;
            if(vm.token) {
                $http.delete(vm.baseUrl + 'admin/credentials/' + twilioCreds.id + '/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $scope.updatingCompanyDetails = false;
                        $scope.twilioCredsList = [];
                    }
                }).catch(function (error) {
                    $scope.updatingCompanyDetails =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.openEditTwilioModal = function (page, size, twilioCreds) {
            vm.theTwilioModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'EditTwilioModalCtrl',
                scope: $scope,
                resolve: {
                    twilioCreds: function () {
                        return twilioCreds;
                    }
                }
            });

            vm.theTwilioModal.result.then(function(twilioCreds){
                if(twilioCreds){
                    vm.getTwilioCredentials();
                }
            }, function(){
            });
        };

        $scope.openAddTwilioModal = function (page, size) {
            if($scope.twilioCredsList.length === 0){
                vm.theTwilioModal = $uibModal.open({
                    animation: true,
                    templateUrl: page,
                    size: size,
                    controller: 'TwilioModalCtrl',
                    scope: $scope
                });

                vm.theTwilioModal.result.then(function(twilioCreds){
                    if(twilioCreds){
                        vm.getTwilioCredentials();
                    }
                }, function(){
                });
            }
        };

        //twilio credentials end

        //sendgrid credentials

        vm.getSendGridCredentials = function () {
            $scope.updatingCompanyDetails = true;
            if(vm.token) {
                $http.get(vm.baseUrl + 'admin/credentials/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $scope.updatingCompanyDetails = false;
                        res.data.data.results.forEach(function (creds) {
                            if(creds.credential_type === 'sendgrid'){
                                $scope.sendGridCredsList = [creds];
                            }
                        });
                    }
                }).catch(function (error) {
                    $scope.updatingCompanyDetails =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        vm.getSendGridCredentials();

        $scope.deleteSendGridCredsPrompt = function (sendGridCreds) {
            $ngConfirm({
                title: 'Delete sendgrid credentials',
                content: 'Are you sure you want to delete the sendgrid credentials?',
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
                            vm.deleteSendGridCreds(sendGridCreds);
                        }
                    }
                }
            });
        };

        vm.deleteSendGridCreds = function (sendGridCreds) {
            $scope.updatingCompanyDetails = true;
            if(vm.token) {
                $http.delete(vm.baseUrl + 'admin/credentials/' + sendGridCreds.id + '/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $scope.updatingCompanyDetails = false;
                        $scope.sendGridCredsList = [];
                    }
                }).catch(function (error) {
                    $scope.updatingCompanyDetails =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.openEditSendGridModal = function (page, size, sendGridCreds) {
            vm.theSendGridModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'EditSendGridModalCtrl',
                scope: $scope,
                resolve: {
                    sendGridCreds: function () {
                        return sendGridCreds;
                    }
                }
            });

            vm.theSendGridModal.result.then(function(sendGridCreds){
                if(sendGridCreds){
                    vm.getSendGridCredentials();
                }
            }, function(){
            });
        };

        $scope.openAddSendGridModal = function (page, size) {
            if($scope.sendGridCredsList.length === 0){
                vm.theSendGridModal = $uibModal.open({
                    animation: true,
                    templateUrl: page,
                    size: size,
                    controller: 'SendGridModalCtrl',
                    scope: $scope
                });

                vm.theSendGridModal.result.then(function(sendGridCreds){
                    if(sendGridCreds){
                        vm.getSendGridCredentials();
                    }
                }, function(){
                });
            }
        };

        //sendgrid credentials end

    }
})();
