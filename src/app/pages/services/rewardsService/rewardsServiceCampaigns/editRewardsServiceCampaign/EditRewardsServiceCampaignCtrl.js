(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.rewardsService.editRewardsServiceCampaign')
        .controller('EditRewardsServiceCampaignsCtrl', EditRewardsServiceCampaignsCtrl);

    /** @ngInject */
    function EditRewardsServiceCampaignsCtrl($scope,$rootScope,$stateParams,environmentConfig,typeaheadService,toastr,_,
                                             $http,localStorageManagement,$location,errorHandler) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.baseUrl = localStorageManagement.getValue('SERVICEURL');
        vm.campaignId = $stateParams.campaignId;
        $scope.currencyOptions = [];
        $scope.updatingCampaign =  false;
        $scope.editCampaignParams = {};
        vm.updatedCampaignObj = {};

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

        $scope.getCampaign = function () {
            $scope.updatingCampaign =  true;
            if(vm.token) {
                $http.get(vm.baseUrl + 'admin/campaigns/' + vm.campaignId + '/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $scope.editCampaignParams = res.data.data;
                        $scope.currencyOptions.forEach(function (element) {
                            if(element.code == $scope.editCampaignParams.currency){
                                $scope.editCampaignParams.currency = element;
                            }
                        });

                        $scope.editCampaignParams.start_date = moment($scope.editCampaignParams.start_date).toDate();
                        $scope.editCampaignParams.end_date = moment($scope.editCampaignParams.end_date).toDate();
                        $scope.updatingCampaign =  false;
                    }
                }).catch(function (error) {
                    $scope.updatingCampaign =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        $scope.getCampaign();

        $scope.campaignChanged = function(field){
            vm.updatedCampaignObj[field] = $scope.editCampaignParams[field];
        };

        $scope.updateCampaign = function () {
            if(vm.updatedCampaignObj.start_date){
                vm.updatedCampaignObj.start_date = moment(new Date(vm.updatedCampaignObj.start_date)).format('YYYY-MM-DD');
            }
            if(vm.updatedCampaignObj.end_date){
                vm.updatedCampaignObj.end_date = moment(new Date(vm.updatedCampaignObj.end_date)).format('YYYY-MM-DD');
            }
            if(vm.updatedCampaignObj.users && vm.updatedCampaignObj.users.length > 0){
                vm.updatedCampaignObj.users = _.pluck(vm.updatedCampaignObj.users,'text');
            }
            if(vm.updatedCampaignObj.groups && vm.updatedCampaignObj.groups.length > 0){
                vm.updatedCampaignObj.groups = _.pluck(vm.updatedCampaignObj.groups,'text');
            }
            if(vm.updatedCampaignObj.tags && vm.updatedCampaignObj.tags.length > 0){
                vm.updatedCampaignObj.tags = _.pluck(vm.updatedCampaignObj.tags,'text');
            }
            if(vm.updatedCampaignObj.currency && vm.updatedCampaignObj.currency.code){
                vm.updatedCampaignObj.currency = vm.updatedCampaignObj.currency.code;
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
