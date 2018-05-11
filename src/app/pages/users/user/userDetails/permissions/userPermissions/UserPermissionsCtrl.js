(function () {
    'use strict';

    angular.module('BlurAdmin.pages.permissions.userPermissions')
        .controller('UserPermissionsCtrl', UserPermissionsCtrl);

    /** @ngInject */
    function UserPermissionsCtrl($scope,environmentConfig,$stateParams,$http,$window,
                                 localStorageManagement,errorHandler,toastr) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.uuid = $stateParams.uuid;
        $scope.userData = JSON.parse($window.sessionStorage.userData);
        vm.checkedLevels = [];
        $scope.loadingPermissions = true;
        $scope.typeOptionsObj = {
            ACCOUNT : 'account',
            ACCOUNT_CURRENCY : 'accountcurrency',
            ACCOUNT_CURRENCY_FEE : 'accountcurrencyfee',
            ACCOUNT_CURRENCY_LIMIT : 'accountcurrencylimit',
            CURRENCY : 'currency',
            BANK_BRANCH_ADDRESS : 'bankbranchaddress',
            COMPANY : 'company',
            COMPANY_ADDRESS : 'companyaddress',
            COMPANY_BANK_ACCOUNT : 'companybankaccount',
            COMPANY_NOTIFICATION : 'companynotification',
            COMPANY_SERVICE : 'companyservice',
            CRYPTO_ACCOUNT : 'cryptoaccount',
            DOCUMENT : 'document',
            USER : 'user',
            USER_ADDRESS : 'useraddress',
            USER_BANK_ACCOUNT : 'userbankaccount',
            MOBILE : 'mobile',
            GROUP: 'group',
            GROUP_TIER: 'grouptier',
            GROUP_TIER_FEE: 'grouptierfee',
            GROUP_TIER_LIMIT: 'grouptierlimit',
            GROUP_TIER_REQUIREMENT: 'grouptierrequirement',
            ACCOUNT_CONFIGURATION: 'accountconfiguration',
            REQUEST : 'request',
            SERVICE : 'service',
            TRANSACTION : 'transaction',
            TRANSACTION_FEE : 'transactionfee',
            TRANSACTION_MESSAGE : 'transactionmessage',
            TRANSACTION_SUBTYPE : 'transactionsubtype',
            TRANSFER : 'transfer',
            WEBHOOK : 'webhook',
            WEBHOOK_REQUEST : 'webhookrequest',
            WEBHOOK_TASK : 'webhooktask'
        };

        $scope.typeOptions = [
            {type:'Account',levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false}]},
            {type:'Account currency',levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false}]},
            {type:'Account currency fee',levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false}]},
            {type:'Account currency limit',levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false}]},
            {type:'Currency',levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false}]},
            {type:'Bank branch address',levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false}]},
            {type:'Company',levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false}]},
            {type:'Company address',levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false}]},
            {type:'Company bank account',levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false}]},
            {type:'Company notification',levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false}]},
            {type:'Company service',levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false}]},
            {type:'Crypto account',levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false}]},
            {type:'Document',levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false}]},
            {type:'User',levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false}]},
            {type:'User address',levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false}]},
            {type:'User bank account',levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false}]},
            {type:'Mobile',levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false}]},
            {type:'Group',levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false}]},
            {type:'Group tier',levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false}]},
            {type:'Group tier fee',levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false}]},
            {type:'Group tier limit',levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false}]},
            {type:'Group tier requirement',levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false}]},
            {type:'Account configuration',levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false}]},
            {type:'Request',levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false}]},
            {type:'Service',levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false}]},
            {type:'Transaction',levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false}]},
            {type:'Transaction fee',levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false}]},
            {type:'Transaction message',levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false}]},
            {type:'Transaction subtype',levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false}]},
            {type:'Transfer',levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false}]},
            {type:'Webhook',levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false}]},
            {type:'Webhook request',levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false}]},
            {type:'Webhook task',levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false}]}
        ];


        vm.getPermissions = function () {
            if(vm.token) {
                $scope.loadingPermissions = true;
                $http.get(environmentConfig.API + '/admin/users/' + vm.uuid + '/permissions/?page_size=200', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingPermissions = false;
                    if (res.status === 200) {
                        vm.checkforAllowedPermissions(res.data.data.results);
                    }
                }).catch(function (error) {
                    $scope.loadingPermissions = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        vm.getPermissions();

        vm.checkforAllowedPermissions = function (permissions) {
            permissions.forEach(function (permission,index) {
                $scope.typeOptions.forEach(function (element,typeOptionsIndex) {
                    if(permission.type.toLowerCase() == element.type.toLowerCase()){
                        element.levels.forEach(function (level,levelIndex) {
                            if(permission.level == level.name){
                                $scope.typeOptions[typeOptionsIndex].levels[levelIndex].enabled = true;
                                $scope.typeOptions[typeOptionsIndex].levels[levelIndex].id = permissions[index].id;
                            }
                        });
                    }
                });
            });
        };

        $scope.trackPermissions = function (typeOption,level) {

            //using id as a flag to see whether they have come from the backend or not

            var findIndexOfLevel = function () {
                var index;
                if(vm.checkedLevels.length == 0){
                    return -1;
                }

                index = vm.checkedLevels.findIndex(function (element) {
                    return (element.type == typeOption.type && element.level == level.name);
                });

                return index;
            };

            //level.enabled && level.id means they were ticked from before

            if(level.enabled && level.id){
                var index = findIndexOfLevel();
                if(index > -1){
                    vm.checkedLevels.splice(index,1);
                    return;
                } else {
                    vm.checkedLevels.push({type: typeOption.type,level: level.name,id: level.id});
                    return;
                }
            } else if(!level.enabled && level.id){
                var index = findIndexOfLevel();
                if(index > -1){
                    vm.checkedLevels.splice(index,1);
                    return;
                } else {
                    vm.checkedLevels.push({type: typeOption.type,level: level.name,id: level.id});
                    return;
                }
            }

            //only level.enabled means they were ticked from before

            if(level.enabled){
                vm.checkedLevels.push({type: typeOption.type,level: level.name});
            } else {
                var index = findIndexOfLevel();
                vm.checkedLevels.splice(index,1);
            }
        };

        $scope.savePermissionsProcess = function(){

            vm.checkedLevels.forEach(function(element,idx,array){
                var type;
                type = element.type.toUpperCase();
                type = type.replace(/ /g, '_');
                if(idx === array.length - 1){
                    if(element.id){
                        vm.deletePermission(element,'last');
                    } else {
                        vm.addPermissions({type: $scope.typeOptionsObj[type],level: element.level},'last');
                    }

                    return false;
                }

                if(element.id){
                    vm.deletePermission(element);
                } else {
                    vm.addPermissions({type: $scope.typeOptionsObj[type],level: element.level});
                }

            });
        };

        vm.addPermissions = function (newPermissionObj,last) {
            if(vm.token) {
                $scope.loadingPermissions = true;
                $http.post(environmentConfig.API + '/admin/users/' + vm.uuid + '/permissions/', newPermissionObj, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 201) {
                        if(last){
                            vm.resetTypeOptions();
                        }
                    }
                }).catch(function (error) {
                    vm.checkedLevels = [];
                    $scope.permissionParams = {
                        type: 'Account'
                    };
                    $scope.loadingPermissions = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.deletePermission = function (permission,last) {
            if(vm.token) {
                $scope.deletingPermission = true;
                $http.delete(environmentConfig.API + '/admin/users/' + vm.uuid + '/permissions/' + permission.id + '/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        if(last){
                            vm.resetTypeOptions();
                        }
                    }
                }).catch(function (error) {
                    $scope.deletingPermission = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.resetTypeOptions = function () {
            $scope.typeOptions.forEach(function (element,idx,array) {
                if(idx === array.length - 1){
                    element.levels = [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false}];
                    vm.finishSavingPermissionsProcess();
                    return false;
                }

                element.levels = [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false}];
            });
        };

        vm.finishSavingPermissionsProcess = function () {
            $scope.loadingPermissions = false;
            vm.checkedLevels = [];
            toastr.success('Permissions successfully saved');
            vm.getPermissions();
        };

    }
})();