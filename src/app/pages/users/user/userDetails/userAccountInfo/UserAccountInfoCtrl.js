(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('UserAccountInfoCtrl', UserAccountInfoCtrl);

    /** @ngInject */
    function UserAccountInfoCtrl($scope,environmentConfig,$stateParams,$uibModal,$http,$window,
                                 $ngConfirm,cookieManagement,errorHandler,toastr) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
        vm.uuid = $stateParams.uuid;
        $scope.loadingUserAccountInfo = true;
        $scope.showAddUserEmail = false;
        $scope.showAddUserNumber = false;
        $scope.booleanOptions = ['False','True'];
        $scope.newUserEmail = {
            primary: 'False',
            verified: 'False'
        };
        $scope.newUserNumber = {
            primary: 'False',
            verified: 'False'
        };


        $scope.toggleAddUserEmailsView = function () {
            $scope.showAddUserEmail = !$scope.showAddUserEmail;
        };

        $scope.toggleAddUserNumbersView = function () {
            $scope.showAddUserNumber = !$scope.showAddUserNumber;
        };

        $scope.copiedSuccessfully= function () {
            toastr.success('Identifier copied successfully');
        };

        // intial user and email and mobile number list calling functions

        vm.getUser = function(){
            if(vm.token) {
                $scope.loadingUserAccountInfo = true;
                $http.get(environmentConfig.API + '/admin/users/' + vm.uuid + '/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $scope.user = res.data.data;
                        vm.getUserEmails();
                    }
                }).catch(function (error) {
                    $scope.loadingUserAccountInfo = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        vm.getUser();

        vm.getUserMobileNumbers = function(){
            if(vm.token) {
                $scope.loadingUserAccountInfo = true;
                $http.get(environmentConfig.API + '/admin/users/mobiles/?user=' + vm.uuid, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $scope.mobilesList = res.data.data.results;
                        $window.sessionStorage.userMobiles = JSON.stringify(res.data.data.results);
                        $scope.loadingUserAccountInfo = false;
                    }
                }).catch(function (error) {
                    $scope.loadingUserAccountInfo = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        // intial user and email and mobile number list calling functions end


        // user mobile numbers functions start

        $scope.createUserNumber = function (newUserNumber) {
            $scope.loadingUserAccountInfo = true;
            newUserNumber.user = vm.uuid;
            newUserNumber.primary = newUserNumber.primary == 'True' ? true:false;
            newUserNumber.verified = newUserNumber.verified == 'True' ? true:false;
            $http.post(environmentConfig.API + '/admin/users/mobiles/',newUserNumber, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                if (res.status === 201) {
                    $scope.newUserNumber = {primary: 'False', verified: 'False'};
                    toastr.success('Mobile number successfully created');
                    $scope.toggleAddUserNumbersView();
                    vm.getUserMobileNumbers()
                }
            }).catch(function (error) {
                $scope.newUserNumber = {primary: 'False', verified: 'False'};
                $scope.loadingUserAccountInfo = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        $scope.updateUserMobile = function (mobile) {
            $scope.loadingUserAccountInfo = true;
            $http.patch(environmentConfig.API + '/admin/users/mobiles/' + mobile.id + '/', {primary: true}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                if (res.status === 200) {
                    toastr.success('Primary mobile number successfully changed');
                    vm.getUserMobileNumbers();
                }
            }).catch(function (error) {
                $scope.loadingUserAccountInfo = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        $scope.deleteUserNumberConfirm = function (mobile) {
            $ngConfirm({
                title: 'Delete number',
                content: "Are you sure you want to delete this user's mobile number?",
                animationBounce: 1,
                animationSpeed: 100,
                scope: $scope,
                buttons: {
                    close: {
                        text: "No",
                        btnClass: 'btn-default dashboard-btn'
                    },
                    ok: {
                        text: "Yes",
                        btnClass: 'btn-primary dashboard-btn',
                        keys: ['enter'], // will trigger when enter is pressed
                        action: function(scope){
                            $scope.deleteUserNumber(mobile);
                        }
                    }
                }
            });
        };

        $scope.deleteUserNumber = function (mobile) {
            $scope.loadingUserAccountInfo = true;
            $http.delete(environmentConfig.API + '/admin/users/mobiles/' + mobile.id + '/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                if (res.status === 200) {
                    toastr.success('Mobile number successfully deleted');
                    vm.getUserMobileNumbers()
                }
            }).catch(function (error) {
                $scope.loadingUserAccountInfo = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        // user mobile numbers functions start

        $scope.openUserMobileModal = function (page, size,mobile) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'UserMobileModalCtrl',
                scope: $scope,
                resolve: {
                    mobile: function () {
                        return mobile;
                    },
                    user: function () {
                        return $scope.user;
                    }
                }
            });

            vm.theModal.result.then(function(mobile){
                if(mobile){
                    vm.getUserMobileNumbers();
                }
            }, function(){
            });
        };

    }
})();
