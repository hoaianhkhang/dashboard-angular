(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.rewardsService.rewardsServiceRewards')
        .controller('RewardUserModalCtrl', RewardUserModalCtrl);

    function RewardUserModalCtrl($scope,environmentConfig,$uibModalInstance,typeaheadService,currencyModifiers,
                                 toastr,$http,localStorageManagement,serializeFiltersService,errorHandler) {

        var vm = this, extensionsList = JSON.parse(localStorageManagement.getValue('extensionsList'));
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.serviceUrl = extensionsList[45];
        // vm.serviceUrl = "https://reward.services.rehive.io/api/";
        $scope.campaignsListOptions = [];
        $scope.rewardUserObj = {
            campaign: {},
            status: 'Accept',
            type: 'Request',
            amount: null,
            currency: {}
        };
        $scope.rewardingUser = false;
        $scope.statusOptions = ['Accept','Reject','Pending'];
        $scope.typeOptions = ['Request', 'Manual' , 'External'];

        $scope.getUsersEmailTypeahead = typeaheadService.getUsersEmailTypeahead();

        $scope.getCampaignList = function () {
            if(vm.token) {
                $scope.rewardingUser =  true;

                $http.get(vm.serviceUrl + 'admin/campaigns/?page_size=250', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        if(res.data.data.results.length > 0){
                            res.data.data.results.unshift({name: 'No campaign selected'});
                            $scope.rewardUserObj.campaign = res.data.data.results[0];
                            $scope.campaignsListOptions = res.data.data.results;
                        }

                        vm.getCompanyCurrencies();
                    }
                }).catch(function (error) {
                    $scope.rewardingUser =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        $scope.getCampaignList();

        vm.getCompanyCurrencies = function(){
            if(vm.token){
                $http.get(environmentConfig.API + '/admin/currencies/?archived=false&page_size=250', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        if(res.data.data.results.length > 0){
                            $scope.currencyOptions = res.data.data.results;
                        }

                        $scope.rewardingUser =  false;
                    }
                }).catch(function (error) {
                    $scope.rewardingUser =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.findUserObj = function (user) {
            $scope.rewardingUser = true;
            $http.get(environmentConfig.API + '/admin/users/?user=' + encodeURIComponent(user), {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                if (res.status === 200) {
                    if(res.data.data.results.length == 1){
                        vm.rewardUserFunc(res.data.data.results[0]);
                    }
                }
            }).catch(function (error) {
                $scope.rewardingUser = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        vm.rewardUserFunc = function (user) {
            var rewardObj = {
                campaign: $scope.rewardUserObj.campaign ? ($scope.rewardUserObj.campaign.id ? $scope.rewardUserObj.campaign.id : null) : null,
                user: user.id,
                amount: $scope.rewardUserObj.amount || null,
                currency: $scope.rewardUserObj.currency ? ($scope.rewardUserObj.currency.code ? $scope.rewardUserObj.currency.code : null) : null,
                status: $scope.rewardUserObj.status ? $scope.rewardUserObj.status.toLowerCase() : null,
                reward_type: $scope.rewardUserObj.type ? $scope.rewardUserObj.type.toLowerCase() : null
            };

            if($scope.rewardUserObj.campaign && $scope.rewardUserObj.campaign.id && $scope.rewardUserObj.amount){
                rewardObj.amount = currencyModifiers.convertToCents($scope.rewardUserObj.amount,$scope.rewardUserObj.campaign.currency.divisibility);
            } else {
                rewardObj.amount = currencyModifiers.convertToCents($scope.rewardUserObj.amount,$scope.rewardUserObj.currency.divisibility);
            }

            rewardObj = serializeFiltersService.objectFilters(rewardObj);

            $http.post(vm.serviceUrl + 'admin/rewards/',rewardObj, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.rewardingUser = false;
                if (res.status === 201 || res.status === 200) {
                    toastr.success('User has been rewarded successfully');
                    $uibModalInstance.close(true);
                }
            }).catch(function (error) {
                $scope.rewardingUser = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };




    }
})();