(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.rewardsService.editRewardsServiceCampaign')
        .controller('EditRewardsServiceCampaignsCtrl', EditRewardsServiceCampaignsCtrl);

    /** @ngInject */
    function EditRewardsServiceCampaignsCtrl($scope,$stateParams,environmentConfig,typeaheadService,toastr,_,$filter,
                                             $http,localStorageManagement,$location,errorHandler,currencyModifiers) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.baseUrl = localStorageManagement.getValue('SERVICEURL');
        vm.campaignId = $stateParams.campaignId;
        $scope.currencyOptions = [];
        $scope.updatingCampaign =  false;
        $scope.editCampaignParams = {};
        vm.updatedCampaignObj = {};
        $scope.amountTypeOptions = ['Fixed' , 'Percentage'];

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
            $scope.updatingCampaign = true;
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
                            $scope.getCampaign();
                        } else {
                            $scope.getCampaign();
                        }
                    }
                }).catch(function (error) {
                    $scope.updatingCampaign = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
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
                        console.log(editObj)
                        $scope.currencyOptions.forEach(function (element) {
                            if(element.code == editObj.currency.code){
                                editObj.currency = element;
                                editObj.start_date = moment(editObj.start_date).toDate();
                                editObj.end_date = moment(editObj.end_date).toDate();
                                editObj.reward_total = currencyModifiers.convertFromCents(editObj.reward_total,editObj.currency.divisibility);
                                editObj.reward_amount = currencyModifiers.convertFromCents(editObj.reward_amount,editObj.currency.divisibility);
                                editObj.amount_type = $filter('capitalizeWord')(editObj.amount_type);
                                $scope.editCampaignParams = editObj;
                            }
                        });

                        $scope.updatingCampaign =  false;
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
                vm.updatedCampaignObj.start_date = moment(new Date(vm.updatedCampaignObj.start_date)).format('YYYY-MM-DD');
            }
            if(vm.updatedCampaignObj.end_date){
                vm.updatedCampaignObj.end_date = moment(new Date(vm.updatedCampaignObj.end_date)).format('YYYY-MM-DD');
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
            }

            $scope.updatingCampaign =  true;
            if(vm.token) {
                $http.patch(vm.baseUrl + 'admin/campaigns/' + $scope.editCampaignParams.identifier + '/',vm.updatedCampaignObj, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        toastr.success('Campaign updated successfully');
                        $location.path('/services/rewards/campaigns');
                    }
                }).catch(function (error) {
                    $scope.updatingCampaign =  false;
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
