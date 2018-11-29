(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.notificationService.notificationServiceSettings')
        .controller('NotificationServiceSettingsCtrl', NotificationServiceSettingsCtrl);

    /** @ngInject */
    function NotificationServiceSettingsCtrl(environmentConfig,$rootScope,$scope,$http,$ngConfirm,$timeout,$location,
                                             localStorageManagement,toastr,errorHandler,$state,$uibModal) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.baseUrl = localStorageManagement.getValue('SERVICEURL');
        vm.serviceId = localStorageManagement.getValue('SERVICEID');
        vm.webhookUrl = "https://notification.services.rehive.io/api/admin/webhook/";
        $rootScope.dashboardTitle = 'Notification service | Rehive';
        $scope.notificationSettingView = '';
        $scope.updatingCompanyDetails =  false;
        vm.updatedCompany = {};
        $scope.company = {};

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
                      console.log($scope.company)
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
                title: 'Deactivate service',
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
                            toastr.success('Service has been successfully deactivated');
                            $location.path('/services');
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
            $state.go('webhooks.list',{"secret": secret,"webhookUrl": vm.webhookUrl});
        };

        $scope.openAddSendGridModal = function (page, size) {
            vm.theSendGridModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'SendGridModalCtrl',
                scope: $scope
            });

            vm.theSendGridModal.result.then(function(service){
                // if(service){
                //     $scope.getServices();
                // }
            }, function(){
            });
        };

        $scope.openAddTwilioModal = function (page, size) {
            vm.theTwilioModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'TwilioModalCtrl',
                scope: $scope
            });

            vm.theTwilioModal.result.then(function(service){
                // if(service){
                //     $scope.getServices();
                // }
            }, function(){
            });
        };



    }

})();
