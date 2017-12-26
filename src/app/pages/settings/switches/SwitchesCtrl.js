(function () {
    'use strict';

    angular.module('BlurAdmin.pages.settings.switches')
        .controller('SwitchesCtrl', SwitchesCtrl);

    /** @ngInject */
    function SwitchesCtrl($scope,environmentConfig,$uibModal,toastr,$http,cookieManagement,errorHandler,$window,stringService,$ngConfirm) {

        var vm = this;
        vm.updatedSwitches = {};
        vm.token = cookieManagement.getCookie('TOKEN');
        $scope.loadingSwitches = true;

        $scope.switchesParams = {
            switch_label: 'Allow transactions',
            enabled: false
        };

        $scope.switchesOptions = ['Allow transactions','Allow transactions for unverified users','Allow unlimited overdrafts',
            'Automatically confirm transactions on creation','Allow custom session duration on authentication','Allow users to manage their accounts'];

        $scope.switchesTypesObj = {
            'transactions': 'Allow transactions',
            'verification': 'Allow transactions for unverified users',
            'overdraft': 'Allow unlimited overdrafts',
            'auto_confirm': 'Automatically confirm transactions on creation',
            'session_duration': 'Allow custom session duration on authentication',
            'manage_accounts': 'Allow users to manage their accounts'
        };

        vm.getSwitches = function () {
            if(vm.token) {
                $scope.loadingSwitches = true;
                $http.get(environmentConfig.API + '/admin/switches/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingSwitches = false;
                    if (res.status === 200) {
                        $scope.switchesList = res.data.data;
                        $window.scrollTo(0, 0);
                    }
                }).catch(function (error) {
                    $scope.loadingSwitches = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        vm.getSwitches();

        vm.getSwitchesApiValues = function (switchesParams) {

            if(switchesParams.switch_label == 'Allow transactions'){
                switchesParams.switch_type = "transactions";
            } else if(switchesParams.switch_label == 'Allow transactions for unverified users') {
                switchesParams.switch_type = "verification";
            } else if(switchesParams.switch_label == 'Allow unlimited overdrafts') {
                switchesParams.switch_type = "overdraft";
            } else if(switchesParams.switch_label == 'Automatically confirm transactions on creation') {
                switchesParams.switch_type = "auto_confirm";
            } else if(switchesParams.switch_label == 'Allow custom session duration on authentication') {
                switchesParams.switch_type = "session_duration";
            } else if(switchesParams.switch_label == 'Allow users to manage their accounts'){
               switchesParams.switch_type = "manage_accounts";
            }

            return switchesParams;
        };

         $scope.addSwitches = function (switchesParams) {
             $scope.loadingSwitches = true;
             switchesParams = vm.getSwitchesApiValues(switchesParams);
             delete switchesParams['switch_label'];
             $http.post(environmentConfig.API + '/admin/switches/', switchesParams, {
                 headers: {
                     'Content-Type': 'application/json',
                     'Authorization': vm.token
                 }
             }).then(function (res) {
                 $scope.loadingSwitches = false;
                 if (res.status === 201) {
                     vm.getSwitches();
                     toastr.success('You have successfully added the switch');
                     $scope.switchesParams = {switch_label: 'Allow transactions', enabled: false};
                     $window.scrollTo(0, 0);
                 }
             }).catch(function (error) {
                 $scope.switchesParams = {switch_label: 'Allow transactions', enabled: false};
                 $scope.loadingSwitches = false;
                 errorHandler.evaluateErrors(error.data);
                 errorHandler.handleErrors(error);
             });
         };

         $scope.toggleSwitchConfirm = function (switches) {
             $ngConfirm({
                 title: 'Edit switch',
                 content: "Are you sure you want to edit <b>" + switches.switch_label + "</b> ?",
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
                             $scope.updateSwitches(switches);
                         }
                     }
                 }
             });
         };

         $scope.updateSwitches = function (switches) {
             $window.scrollTo(0, 0);
             $scope.loadingSwitches = true;
             switches.enabled = !switches.enabled;
             $http.patch(environmentConfig.API + '/admin/switches/'+ switches.id + '/', {enabled: switches.enabled}, {
                 headers: {
                     'Content-Type': 'application/json',
                     'Authorization': vm.token
                 }
             }).then(function (res) {
                 $scope.loadingSwitches = false;
                 if (res.status === 200) {
                     vm.getSwitches();
                     toastr.success('You have successfully updated the switch');
                 }
             }).catch(function (error) {
                 $scope.loadingSwitches = false;
                 errorHandler.evaluateErrors(error.data);
                 errorHandler.handleErrors(error);
             });
         };

        vm.findIndexOfSwitches = function(element){
            return this.id == element.id;
        };

        $scope.openSwitchesModal = function (page, size,switches) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'SwitchModalCtrl',
                scope: $scope,
                resolve: {
                    switches: function () {
                        return switches;
                    }
                }
            });

            vm.theModal.result.then(function(switches){
                var index = $scope.switchesList.findIndex(vm.findIndexOfSwitches,switches);
                $scope.switchesList.splice(index, 1);
            }, function(){
            });
        };
    }
})();
