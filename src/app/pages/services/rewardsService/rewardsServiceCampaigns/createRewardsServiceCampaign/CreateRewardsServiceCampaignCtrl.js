(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.rewardsService.createRewardsServiceCampaign')
        .controller('CreateRewardsServiceCampaignsCtrl', CreateRewardsServiceCampaignsCtrl);

    /** @ngInject */
    function CreateRewardsServiceCampaignsCtrl($scope,$rootScope,environmentConfig,typeaheadService,toastr,_,
                                               $http,localStorageManagement,$location,errorHandler,serializeFiltersService) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.baseUrl = localStorageManagement.getValue('SERVICEURL');
        $scope.currencyOptions = [];
        $scope.addingCampaign =  false;
        $scope.newCampaignParams = {
            name: '',
            description: '',
            currency: {},
            startDate: null,
            endDate: null,
            rewardType: 'basic',
            rewardAmount: null,
            rewardPercentage: null,
            status: 'active',
            rewardTotal: null,
            userVolumeLimit: null,
            userLimit: null,
            userTransactionLimit: null,
            users: [],
            groups: [],
            tags: []
        };

        //for angular datepicker
        $scope.dateObj = {};
        $scope.dateObj.format = 'MM/dd/yyyy';
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
                $http.get(environmentConfig.API + '/admin/currencies/?enabled=true&page_size=250', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        if(res.data.data.results.length > 0){
                            $scope.currencyOptions = res.data.data.results;
                        }
                    }
                }).catch(function (error) {
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        vm.getCompanyCurrencies();

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
                company: $rootScope.pageTopObj.companyObj.identifier,
                start_date: null,
                end_date: null,
                reward_type: newCampaignParams.rewardType,
                reward_amount: newCampaignParams.rewardAmount,
                reward_percentage: newCampaignParams.rewardPercentage,
                status: newCampaignParams.status,
                reward_total: newCampaignParams.rewardTotal,
                user_volume_limit: newCampaignParams.userVolumeLimit,
                user_limit: newCampaignParams.userLimit,
                user_transaction_limit: newCampaignParams.userTransactionLimit,
                users: [],
                groups: [],
                tags: []
            };

            newCampaign.start_date = moment(new Date(newCampaignParams.startDate)).format('YYYY-MM-DD');
            newCampaign.end_date = moment(new Date(newCampaignParams.endDate)).format('YYYY-MM-DD');

            if(newCampaignParams.users.length > 0){
                newCampaign.users = _.pluck(newCampaignParams.users,'text');
            }
            if(newCampaignParams.groups.length > 0){
                newCampaign.groups = _.pluck(newCampaignParams.groups,'text');
            }
            if(newCampaignParams.tags.length > 0){
                newCampaign.tags = _.pluck(newCampaignParams.tags,'text');
            }

            newCampaign = serializeFiltersService.objectFilters(newCampaign);

            $scope.addingCampaign =  true;
            if(vm.token) {
                $http.post(vm.baseUrl + 'admin/campaigns/',newCampaign, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 201 || res.status === 200) {
                        toastr.success('Campaign added successfully');
                        $location.path('/services/rewards/campaigns');
                    }
                }).catch(function (error) {
                    $scope.addingCampaign =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.goToCampaignListView = function () {
            $location.path('/services/rewards/campaigns');
        };


    }
})();
