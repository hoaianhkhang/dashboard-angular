(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.rewardsService.createRewardsServiceCampaign')
        .controller('CreateRewardsServiceCampaignsCtrl', CreateRewardsServiceCampaignsCtrl);

    /** @ngInject */
    function CreateRewardsServiceCampaignsCtrl($scope,$rootScope,Rehive,typeaheadService,toastr,_,currencyModifiers,
                                               $http,localStorageManagement,$location,errorHandler,serializeFiltersService) {

        var vm = this, extensionsList = JSON.parse(localStorageManagement.getValue('extensionsList'));
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.serviceUrl = extensionsList[45];
        // vm.serviceUrl = "https://reward.services.rehive.io/api/";
        $scope.companyDateFormatString = localStorageManagement.getValue('DATE_FORMAT');
        $scope.currencyOptions = [];
        $scope.addingCampaign =  false;
        $scope.campaignUserEmailForAccount = '';
        $scope.campaignUserAccounts = [];
        $scope.newCampaignParams = {
            name: '',
            description: '',
            currency: {},
            startDate: null,
            endDate: null,
            rewardTotal: null,
            rewardAmount: null,
            account: {},
            rewardPercentage: null,
            amountType: 'Fixed',
            status: 'active',
            max_per_user: null,
            event: '',
            visible: true,
            request: false,
            // groups: []
        };
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

        vm.getCompanyCurrencies = function(){
            if(vm.token){
                Rehive.admin.currencies.get({filters: {
                    page:1,
                    page_size: 250,
                    archived: false
                }}).then(function (res) {
                    $scope.currencyOptions = res.results.slice();
                    $scope.$apply();
                }, function (error) {
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.getCompanyCurrencies();

        $scope.getAllAccounts = function(){
            Rehive.admin.accounts.get({filters: {page_size: 250}}).then(function (res) {
                $scope.accountOptions = res.results.slice();
                $scope.$apply();
            }, function (error) {
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };
        $scope.getAllAccounts();

        $scope.addCampaign = function (newCampaignParams) {

            if(moment(newCampaignParams.endDate).isBefore(moment(newCampaignParams.startDate))){
                toastr.error('End date cannot be in the past or before start date.');
                return;
            } else if(moment(newCampaignParams.startDate).isBefore(moment().subtract(1,'days'))){
                toastr.error('Start date cannot be in the past.');
                return;
            }

            var newCampaign = {
                name: newCampaignParams.name,
                description: newCampaignParams.description,
                currency: newCampaignParams.currency.code,
                company: $rootScope.pageTopObj.companyObj.id,
                start_date: null,
                end_date: null,
                reward_total: newCampaignParams.rewardTotal ? currencyModifiers.convertToCents(newCampaignParams.rewardTotal,newCampaignParams.currency.divisibility) : null,
                reward_amount: newCampaignParams.rewardAmount ? currencyModifiers.convertToCents(newCampaignParams.rewardAmount,newCampaignParams.currency.divisibility) : null,
                account: (newCampaignParams.account && newCampaignParams.account.reference) ? newCampaignParams.account.reference : null,
                reward_percentage: newCampaignParams.rewardPercentage,
                amount_type: newCampaignParams.amountType ? newCampaignParams.amountType.toLowerCase() : null,
                status: newCampaignParams.status,
                max_per_user: newCampaignParams.max_per_user,
                visible: newCampaignParams.visible,
                request: newCampaignParams.request,
                event: newCampaignParams.event,
                // groups: (_.pluck(newCampaignParams.groups,'text')).join(),
                users: (_.pluck(newCampaignParams.users,'text'))
            };

            newCampaign.start_date = moment(new Date(newCampaignParams.startDate)).format('YYYY-MM-DD') +'T00:00:00Z';
            newCampaign.end_date = moment(new Date(newCampaignParams.endDate)).format('YYYY-MM-DD') +'T00:00:00Z';

            //correct date format
            // newCampaign.start_date = Date.parse(moment(new Date(newCampaignParams.startDate)).format('YYYY-MM-DD') +'T00:00:00');
            // newCampaign.end_date = Date.parse(moment(new Date(newCampaignParams.endDate)).format('YYYY-MM-DD') +'T00:00:00');

            // if(newCampaignParams.users.length > 0){
            //     newCampaign.users = _.pluck(newCampaignParams.users,'text');
            // }
            // if(newCampaignParams.groups.length > 0){
            //     newCampaign.groups = _.pluck(newCampaignParams.groups,'text');
            // }
            // if(newCampaignParams.tags.length > 0){
            //     newCampaign.tags = _.pluck(newCampaignParams.tags,'text');
            // }

            if(newCampaign.amount_type == "both"){
                newCampaign.amount_type = 'fixedpercentage';
            }

            if(newCampaign.event){
                var event;
                event = newCampaign.event.toUpperCase();
                event = event.replace(/ /g, '_');
                newCampaign.event = vm.eventOptionsObj[event];
            }

            newCampaign = serializeFiltersService.objectFilters(newCampaign);

            $scope.addingCampaign =  true;
            if(vm.token) {
                $http.post(vm.serviceUrl + 'admin/campaigns/',newCampaign, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 201 || res.status === 200) {
                        toastr.success('Campaign added successfully');
                        // $location.path('/services/rewards/campaigns');
                        $location.path('/extensions/rewards/campaigns');
                    }
                }).catch(function (error) {
                    $scope.addingCampaign =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.showAccountList = false;
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
