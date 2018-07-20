(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.rewardsService.rewardsServiceRequests')
        .controller('RewardsServiceRequestsModalCtrl', RewardsServiceRequestsModalCtrl);

    function RewardsServiceRequestsModalCtrl($scope,request,environmentConfig,$uibModalInstance,$ngConfirm,
                                             toastr,$http,localStorageManagement,errorHandler,$filter) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.serviceUrl = localStorageManagement.getValue('SERVICEURL');
        $scope.request = request;
        $scope.loadingRequest = false;
        $scope.editingRequest = false;
        $scope.userObj = {};
        $scope.updateRequestObj = {status: $filter('capitalizeWord')(request.status)};
        $scope.requestStatusOptions = ['Pending','Accept','Reject'];

        $scope.toggleEditingRequest = function () {
            $scope.editingRequest = !$scope.editingRequest;
        };

        $scope.findUserObj = function () {
            $scope.loadingRequest = true;
            $http.get(environmentConfig.API + '/admin/users/?user=' + $scope.request.user, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                if (res.status === 200) {
                    $scope.loadingRequest = false;
                    if(res.data.data.results.length == 1){
                        $scope.userObj = res.data.data.results[0];
                    }
                }
            }).catch(function (error) {
                $scope.loadingRequest = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };
        $scope.findUserObj();

        $scope.updateRequestPrompt = function (status) {
            $ngConfirm({
                title: 'Update request',
                content: 'Are you sure you want to update this request?',
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
                            vm.updateRequest(status);
                        }
                    }
                }
            });
        };

        vm.updateRequest = function () {
            if(vm.token) {
                $scope.loadingRequest = true;
                $http.patch(vm.serviceUrl + 'admin/campaigns/requests/' + request.identifier + '/',
                    {
                        status: $scope.updateRequestObj.status.toLowerCase()
                    }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $scope.loadingRequest = false;
                        toastr.success('Request has been updated successfully');
                        $uibModalInstance.close(true);
                    }
                }).catch(function (error) {
                    $scope.loadingRequest = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        //single reward request does not send campaign name but list api does
        // $scope.getRewardsRequests = function () {
        //     if(vm.token) {
        //         $scope.loadingRequest = true;
        //         $http.get(vm.serviceUrl + 'admin/campaigns/requests/' + request.identifier + '/', {
        //             headers: {
        //                 'Content-Type': 'application/json',
        //                 'Authorization': vm.token
        //             }
        //         }).then(function (res) {
        //             if (res.status === 200) {
        //                 $scope.loadingRequest = false;
        //                 vm.request = res.data.data;
        //                 console.log(res.data.data)
        //             }
        //         }).catch(function (error) {
        //             $scope.loadingRequest = false;
        //             errorHandler.evaluateErrors(error.data);
        //             errorHandler.handleErrors(error);
        //         });
        //     }
        // };
        // $scope.getRewardsRequests();



    }
})();