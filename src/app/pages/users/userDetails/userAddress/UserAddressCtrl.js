(function () {
    'use strict';

    angular.module('BlurAdmin.pages.userDetails')
        .controller('UserAddressCtrl', UserAddressCtrl);

    /** @ngInject */
    function UserAddressCtrl($scope,environmentConfig,$stateParams,$http,cookieManagement,
                             $window,errorHandler,$uibModal,toastr,$filter,$ngConfirm) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
        vm.uuid = $stateParams.uuid;
        $scope.userAddressParams = {
            country: 'US',
            status: 'Pending'
        };
        vm.updatedUserAddress = {};
        $scope.loadingUserAddress = true;
        $scope.addingUserAddress = false;
        $scope.editingUserAddress = false;
        $scope.editUserAddress = {};
        $scope.statusOptions = ['Pending', 'Incomplete', 'Declined', 'Verified'];

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

        $scope.toggleAddUserAddressView = function () {
            $scope.addingUserAddress = !$scope.addingUserAddress;
        };

        $scope.addUserAddress = function(userAddressParams){
            if(vm.token) {
                userAddressParams.user = vm.uuid;
                userAddressParams.status = userAddressParams.status.toLowerCase();
                $scope.loadingUserAddress = true;
                $scope.toggleAddUserAddressView();
                $http.post(environmentConfig.API + '/admin/users/addresses/',userAddressParams,{
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingUserAddress = false;
                    if (res.status === 201) {
                        $scope.userAddressParams = {country: 'US', status: 'pending'};
                        toastr.success('Successfully added user address!');
                        vm.getUserAddress()
                    }
                }).catch(function (error) {
                    $scope.loadingUserAddress = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.toggleEditUserAddressView = function (userAddress) {
            if(userAddress){
                vm.getAddress(userAddress);
            } else {
                $scope.editUserAddress = {};
                vm.getUserAddress();
            }

            $scope.editingUserAddress = !$scope.editingUserAddress;
        };

        vm.getAddress = function (userAddress) {
            $scope.loadingUserAddress = true;
            $http.get(environmentConfig.API + '/admin/users/addresses/' + userAddress.id + '/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.loadingUserAddress = false;
                if (res.status === 200) {
                    $scope.editUserAddress = res.data.data;
                    $scope.editUserAddress.status = $filter('capitalizeWord')(res.data.data.status);
                }
            }).catch(function (error) {
                $scope.loadingUserAddress = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        $scope.userAddressChanged =  function (field) {
            vm.updatedUserAddress[field] = $scope.editUserAddress[field];
        };

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

        $scope.updateUserAddress = function(){
            if(vm.token) {
                $scope.loadingUserAddress = true;
                $scope.editingUserAddress = !$scope.editingUserAddress;
                vm.updatedUserAddress.status ? vm.updatedUserAddress.status = vm.updatedUserAddress.status.toLowerCase() : '';
                $http.patch(environmentConfig.API + '/admin/users/addresses/' + $scope.editUserAddress.id + '/',vm.updatedUserAddress,{
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingUserAddress = false;
                    if (res.status === 200) {
                        vm.updatedUserAddress = {};
                        $scope.editUserAddress = {};
                        toastr.success('Successfully updated user address');
                        vm.getUserAddress();
                    }
                }).catch(function (error) {
                    $scope.loadingUserAddress = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
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
                    vm.getUserAddress();
                }
            }, function(){
            });
        };


    }
})();
