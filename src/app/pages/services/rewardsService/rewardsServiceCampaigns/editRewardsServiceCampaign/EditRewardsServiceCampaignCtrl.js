(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.rewardsService.editRewardsServiceCampaign')
        .controller('EditRewardsServiceCampaignsCtrl', EditRewardsServiceCampaignsCtrl);

    /** @ngInject */
    function EditRewardsServiceCampaignsCtrl($scope,$stateParams,Rehive,typeaheadService,toastr,_,$filter,
                                             $http,localStorageManagement,$location,errorHandler,currencyModifiers) {

        var vm = this, extensionsList = JSON.parse(localStorageManagement.getValue('extensionsList'));
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.baseUrl = extensionsList[45];
        // vm.baseUrl = "https://reward.services.rehive.io/api/";
        $scope.companyDateFormatString = localStorageManagement.getValue('DATE_FORMAT');
        vm.campaignId = $stateParams.campaignId;
        $scope.currencyOptions = [];
        $scope.updatingCampaign =  false;
        $scope.editCampaignParams = {};
        $scope.campaignUserEmailForAccount = '';
        $scope.campaignUserAccounts = [];
        $scope.showAccountList = false;
        $scope.showAdvancedOptions = false;
        vm.updatedCampaignObj = {};
        $scope.amountTypeOptions = ['Fixed' , 'Percentage', 'Both'];

        vm.eventOptionsObj = {
            USER_CREATE: 'user.create',
            USER_UPDATE: 'user.update',
            USER_PASSWORD_RESET: 'user.password.reset',
            USER_PASSWORD_SET: 'user.password.set',
            USER_EMAIL_VERIFY: 'user.email.verify',
            USER_MOBILE_VERIFY: 'user.mobile.verify',
            ADDRESS_CREATE: 'address.create',
            ADDRESS_UPDATE: 'address.update',
            DOCUMENT_CREATE: 'document.create',
            DOCUMENT_UPDATE: 'document.update',
            BANK_ACCOUNT_CREATE: 'bank_account.create',
            BANK_ACCOUNT_UPDATE: 'bank_account.update',
            CRYPTO_ACCOUNT_CREATE: 'crypto_account.create',
            CRYPTO_ACCOUNT_UPDATE: 'crypto_account.update',
            TRANSACTION_CREATE: 'transaction.create',
            TRANSACTION_UPDATE: 'transaction.update',
            TRANSACTION_DELETE: 'transaction.delete',
            TRANSACTION_INITIATE: 'transaction.initiate',
            TRANSACTION_EXECUTE: 'transaction.execute'
        };

        $scope.eventOptions = ['','User Create','User Update','User Password Reset','User Password Set','User Email Verify','User Mobile Verify',
            'Address Create','Address Update','Document Create','Document Update',
            'Bank Account Create','Bank Account Update','Crypto Account Create','Crypto Account Update',
            'Transaction Create','Transaction Update','Transaction Delete','Transaction Initiate','Transaction Execute'];

        //for angular datepicker
        $scope.dateObj = {};
        $scope.dateObj.format = $scope.companyDateFormatString;
        $scope.popup1 = {};
        $scope.open1 = function() {
            $scope.popup1.opened = true;
        };

        $scope.popup2 = {};
        $scope.open2 = function() {
            $scope.popup2.opened = true;
        };

        $scope.getUsersEmailTypeahead = typeaheadService.getUsersEmailTypeahead();
        $scope.getGroupsTypeahead = typeaheadService.getGroupsTypeahead();

        $scope.getAllAccounts = function(){
            Rehive.admin.accounts.get({filters: {page_size: 250}}).then(function (res) {
                if(res.results.length > 0){
                    $scope.accountOptions = res.results.slice();
                    $scope.getCampaign();
                    $scope.$apply();
                } else {
                    $scope.getCampaign();
                    $scope.$apply();
                }
            }, function (error) {
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

        vm.getCompanyCurrencies = function(){
            if(vm.token){
                $scope.updatingCampaign = true;
                Rehive.admin.currencies.get({filters: {
                    page:1,
                    page_size: 250,
                    archived: false
                }}).then(function (res) {
                    if(res.results.length > 0){
                        $scope.currencyOptions = res.results.slice();
                        $scope.getAllAccounts();
                        $scope.$apply();
                    } else {
                        $scope.getAllAccounts();
                        $scope.$apply();
                    }
                }, function (error) {
                    $scope.updatingCampaign = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.getCompanyCurrencies();

        $scope.getCampaign = function () {
            if(vm.token) {
                $http.get(vm.baseUrl + 'admin/campaigns/' + vm.campaignId + '/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        var editObj = {};
                        editObj = res.data.data;
                        $scope.currencyOptions.forEach(function (element) {
                            if(element.code == editObj.currency.code){
                                editObj.currency = element;
                                editObj.start_date = moment(editObj.start_date).toDate();
                                editObj.end_date = moment(editObj.end_date).toDate();
                                editObj.reward_total = currencyModifiers.convertFromCents(editObj.reward_total,editObj.currency.divisibility);
                                editObj.reward_amount = currencyModifiers.convertFromCents(editObj.reward_amount,editObj.currency.divisibility);
                                editObj.amount_type = $filter('capitalizeWord')(editObj.amount_type) == 'Fixed' ? 'Fixed' :
                                    $filter('capitalizeWord')(editObj.amount_type) == 'Percentage' ? 'Percentage' : 'Both';
                                if(editObj.event){
                                    editObj.event = $filter('capitalizeDottedSentence')(editObj.event);
                                    editObj.event = $filter('capitalizeUnderscoredSentence')(editObj.event);
                                } else {
                                    editObj.event = '';
                                }
                                // if(editObj.groups){
                                //     editObj.groups = editObj.groups.split(',');
                                // } else {
                                //     editObj.groups = [];
                                // }
                                if(editObj.users){
                                    editObj.users = editObj.users;
                                } else {
                                    editObj.users = [];
                                }
                                if(editObj.account){
                                    $scope.accountOptions.forEach(function (element) {
                                        if(element.reference == editObj.account){
                                            editObj.account = element;
                                            $scope.campaignUserEmailForAccount = editObj.account.user.email;
                                            $scope.accountOptions.forEach(function(account){
                                                if(account.user.email == $scope.campaignUserEmailForAccount){
                                                    $scope.campaignUserAccounts.push(account);
                                                }
                                            });
                                            $scope.showAccountList = true;
                                            $scope.editCampaignParams = editObj;
                                            $scope.updatingCampaign =  false;
                                        }
                                    });
                                } else {
                                    $scope.editCampaignParams = editObj;
                                    $scope.updatingCampaign =  false;
                                }
                            }
                        });
                    }
                }).catch(function (error) {
                    $scope.updatingCampaign =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.campaignChanged = function(field){
            vm.updatedCampaignObj[field] = $scope.editCampaignParams[field];
        };

        $scope.updateCampaign = function () {
            if(moment(vm.updatedCampaignObj.end_date).isBefore(moment(vm.updatedCampaignObj.start_date))){
                toastr.error('End date cannot be in the past or before start date.');
                return;
            } else if(moment(vm.updatedCampaignObj.start_date).isBefore(moment().subtract(1,'days'))){
                toastr.error('Start date cannot be in the past.');
                return;
            }

            if(vm.updatedCampaignObj.start_date){
               // vm.updatedCampaignObj.start_date = moment(new Date(vm.updatedCampaignObj.start_date)).format('YYYY-MM-DD');
                vm.updatedCampaignObj.start_date = moment(new Date(vm.updatedCampaignObj.startDate)).format('YYYY-MM-DD') +'T00:00:00Z';
            }
            if(vm.updatedCampaignObj.end_date){
                //vm.updatedCampaignObj.end_date = moment(new Date(vm.updatedCampaignObj.end_date)).format('YYYY-MM-DD');
                vm.updatedCampaignObj.end_date = moment(new Date(vm.updatedCampaignObj.end_date)).format('YYYY-MM-DD') +'T00:00:00Z';
            }
            if(vm.updatedCampaignObj.currency && vm.updatedCampaignObj.currency.code){
                vm.updatedCampaignObj.currency = vm.updatedCampaignObj.currency.code;
            }
            if(vm.updatedCampaignObj.reward_total){
                vm.updatedCampaignObj.reward_total = currencyModifiers.convertToCents(vm.updatedCampaignObj.reward_total,$scope.editCampaignParams.currency.divisibility);
                vm.updatedCampaignObj.currency = $scope.editCampaignParams.currency.code;
            }
            if(vm.updatedCampaignObj.reward_amount){
                vm.updatedCampaignObj.reward_amount = currencyModifiers.convertToCents(vm.updatedCampaignObj.reward_amount,$scope.editCampaignParams.currency.divisibility);
                vm.updatedCampaignObj.currency = $scope.editCampaignParams.currency.code;
            }
            if(vm.updatedCampaignObj.amount_type){
                vm.updatedCampaignObj.amount_type = vm.updatedCampaignObj.amount_type.toLowerCase();
                if(vm.updatedCampaignObj.amount_type == 'both'){
                    vm.updatedCampaignObj.amount_type = 'fixedpercentage';
                }
            }
            if(vm.updatedCampaignObj.account && vm.updatedCampaignObj.account.reference){
                vm.updatedCampaignObj.account = vm.updatedCampaignObj.account.reference;
            }
            if(vm.updatedCampaignObj.users){
                vm.updatedCampaignObj.users = (_.pluck(vm.updatedCampaignObj.users,'text'));
            }
            // if(vm.updatedCampaignObj.groups){
            //     vm.updatedCampaignObj.groups = (_.pluck(vm.updatedCampaignObj.groups,'text')).join();
            // }
            if(vm.updatedCampaignObj.event){
                if(!vm.updatedCampaignObj.event.includes(".")){
                    var event;
                    event = vm.updatedCampaignObj.event.toUpperCase();
                    event = event.replace(/ /g, '_');
                    vm.updatedCampaignObj.event = vm.eventOptionsObj[event];
                }
            }

            $scope.updatingCampaign =  true;
            if(vm.token) {
                $http.patch(vm.baseUrl + 'admin/campaigns/' + $scope.editCampaignParams.id + '/',vm.updatedCampaignObj, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        toastr.success('Campaign updated successfully');
                        $scope.getCampaign();
                    }
                }).catch(function (error) {
                    $scope.updatingCampaign =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.onSelect = function($item, $model, $label){
            $scope.campaignUserAccounts = [];
            $scope.accountOptions.forEach(function(account){
                if(account.user.email == $model){
                    $scope.campaignUserAccounts.push(account);
                }
            });
            if($scope.campaignUserAccounts.length > 0){
                $scope.showAccountList = true;
                $scope.newCampaignParams.account = $scope.campaignUserAccounts[0];
            }
        };

        $scope.emailChanging = function(){
            $scope.showAccountList = false;
        };

        $scope.goToCampaignListView = function () {
            // $location.path('/services/rewards/campaigns');
            $location.path('/extensions/rewards/campaigns');
        };


    }
})();
