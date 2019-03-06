(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.ethereumService.ethereumServiceSettings')
        .controller('HdKeysCtrl', HdKeysCtrl);

    /** @ngInject */
    function HdKeysCtrl($scope,$http,localStorageManagement,toastr,errorHandler,$ngConfirm) {

        var vm = this;
        // vm.serviceUrl = localStorageManagement.getValue('SERVICEURL');
        vm.serviceUrl = "https://ethereum.services.rehive.io/api/1/";
        vm.token = localStorageManagement.getValue('TOKEN');
        $scope.loadingHdkeys =  true;
        $scope.addingHdkey =  false;
        $scope.newHdKey = {
            primary: false,
            key_type: 'xpub'
        };
        $scope.keyTypeOptions = ['xpub','xpriv'];

        vm.getHdkeys = function () {
            $scope.loadingHdkeys =  true;
            if(vm.token) {
                $http.get(vm.serviceUrl + 'admin/hdkeys/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingHdkeys =  false;
                    if (res.status === 200) {
                        $scope.hdKeysList = res.data.data.results;
                    }
                }).catch(function (error) {
                    $scope.loadingHdkeys =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        vm.getHdkeys();

        $scope.toggleAddHdkeyView = function(){
            $scope.addingHdkey = !$scope.addingHdkey;
        };

        $scope.toggleHdKeyStatusPrompt = function (hdKey,status) {
            $ngConfirm({
                title: 'Disable public key',
                content: 'Are you sure you want to disable this key? ' +
                'If disabled all addresses associated with the key will be monitored for another 21 days',
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
                            scope.toggleHdKeyStatus(hdKey,status);
                        }
                    }
                }
            });
        };

        $scope.toggleHdKeyStatus = function(hdKey,status){
            $scope.loadingHdkeys =  true;
            if(vm.token) {
                $http.patch(vm.serviceUrl + 'admin/hdkeys/' + hdKey.id + '/', {status: status}, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingHdkeys =  false;
                    if (res.status === 200) {
                        if(status == 'Active'){
                            toastr.success('Public key successfully disabled');
                        } else {
                            toastr.success('Public key successfully activated');
                        }
                        vm.getHdkeys();
                    }
                }).catch(function (error) {
                    $scope.loadingHdkeys =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };


        $scope.toggleHdKeyPrimaryStatus = function(hdKey){
            $scope.loadingHdkeys =  true;
            if(vm.token) {
                $http.patch(vm.serviceUrl + 'admin/hdkeys/' + hdKey.id + '/', {primary: hdKey.primary}, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingHdkeys =  false;
                    if (res.status === 200) {
                        toastr.success('Public key primary status successfully changed');
                        vm.getHdkeys();
                    }
                }).catch(function (error) {
                    $scope.loadingHdkeys =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.createHdKey = function(newHdKey){
            $scope.loadingHdkeys =  true;
            newHdKey.key_type = 'xpub';
            if(vm.token) {
                $http.post(vm.serviceUrl + 'admin/hdkeys/',newHdKey, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.toggleAddHdkeyView();
                    $scope.loadingHdkeys =  false;
                    if (res.status === 201) {
                        $scope.newHdKey = {
                            primary: false,
                            key_type: 'xpub'
                        };
                        toastr.success('Public key primary status successfully created');
                        vm.getHdkeys();
                    }
                }).catch(function (error) {
                    $scope.newHdKey = {
                        primary: false,
                        key_type: 'xpub'
                    };
                    $scope.loadingHdkeys =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        }


    }
})();
