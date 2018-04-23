(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('UserAddressCtrl', UserAddressCtrl);

    /** @ngInject */
    function UserAddressCtrl($scope,environmentConfig,$stateParams,$http,localStorageManagement,
                             $window,errorHandler,$uibModal,toastr,$ngConfirm) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.uuid = $stateParams.uuid;
        $scope.userAddressParams = {
            country: 'US',
            status: 'Pending'
        };
        vm.updatedUserAddress = {};
        $scope.loadingUserAddress = true;
        $scope.editUserAddress = {};
        $scope.statusOptions = ['Pending', 'Incomplete', 'Declined', 'Verified'];
        $scope.optionsId = '';

        $scope.closeAddressOptionsBox = function () {
            $scope.optionsId = '';
        };

        $scope.showAddressOptionsBox = function (address) {
            $scope.optionsId = address.id;
        };

        vm.getUserAddress = function(){
            if(vm.token) {
                $scope.loadingUserAddress = true;
                $http.get(environmentConfig.API + '/admin/users/addresses/?user=' + vm.uuid, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingUserAddress = false;
                    if (res.status === 200) {
                        $window.sessionStorage.userAddresses = JSON.stringify(res.data.data.results);
                        $scope.userAddresses = res.data.data.results;
                    }
                }).catch(function (error) {
                    $scope.loadingUserAddress = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        vm.getUserAddress();

        $scope.verifyUserAddressConfirm = function (id,status) {
            $ngConfirm({
                title: 'Verify user address',
                content: 'Are you sure you want to verify this address?',
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
                            $scope.verifyUserAddress(id,status);
                        }
                    }
                }
            });
        };

        $scope.verifyUserAddress = function(id,status){
            if(vm.token) {
                $scope.loadingUserAddress = true;
                $http.patch(environmentConfig.API + '/admin/users/addresses/' + id + '/',{status: status},{
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingUserAddress = false;
                    if (res.status === 200) {
                        $scope.optionsId = '';
                        toastr.success('Successfully verified user address');
                        vm.getUserAddress();
                    }
                }).catch(function (error) {
                    $scope.loadingUserAddress = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.openAddUserAddressModal = function (page, size) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'AddUserAddressModalCtrl',
                scope: $scope
            });

            vm.theModal.result.then(function(address){
                if(address){
                    $scope.optionsId = '';
                    vm.getUserAddress();
                }
            }, function(){
            });
        };

        $scope.openEditUserAddressModal = function (page, size,address) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'EditUserAddressModalCtrl',
                scope: $scope,
                resolve: {
                    address: function () {
                        return address;
                    }
                }
            });

            vm.theModal.result.then(function(address){
                if(address){
                    $scope.optionsId = '';
                    vm.getUserAddress();
                }
            }, function(){
            });
        };

        $scope.openUserAddressModal = function (page, size,address) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'UserAddressModalCtrl',
                scope: $scope,
                resolve: {
                    address: function () {
                        return address;
                    }
                }
            });

            vm.theModal.result.then(function(address){
                if(address){

                    $scope.optionsId = '';
                    vm.getUserAddress();
                }
            }, function(){
            });
        };


    }
})();
