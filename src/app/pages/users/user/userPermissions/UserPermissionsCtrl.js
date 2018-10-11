(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user.permissions')
        .controller('UserPermissionsCtrl', UserPermissionsCtrl);

    /** @ngInject */

    function UserPermissionsCtrl($scope,Rehive,$stateParams,$window,$timeout,
                                 $rootScope,localStorageManagement,errorHandler,toastr) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        vm.uuid = $stateParams.uuid;
        $rootScope.shouldBeBlue = 'Users';
        $scope.userData = JSON.parse($window.sessionStorage.userData);
        vm.checkedLevels = [];
        $scope.loadingPermissions = true;
        $scope.totalPermissionsObj = {};
        vm.mockPermissionsResults = [
            {
                id: 3,
                section: "admin",
                type: "account",
                level: "add"
            },
            {
                id: 5,
                section: "admin",
                type: "account",
                level: "change"
            },
            {
                id: 7,
                section: "admin",
                type: "account",
                level: "delete"
            },
            {
                id: 1,
                section: "admin",
                type: "account",
                level: "view"
            },
            {
                id: 11,
                section: "admin",
                type: "address",
                level: "add"
            },
            {
                id: 13,
                section: "admin",
                type: "address",
                level: "change"
            },
            {
                id: 15,
                section: "admin",
                type: "address",
                level: "delete"
            },
            {
                id: 9,
                section: "admin",
                type: "address",
                level: "view"
            },
            {
                id: 19,
                section: "admin",
                type: "currency",
                level: "add"
            },
            {
                id: 21,
                section: "user",
                type: "currency",
                level: "change"
            },
            {
                id: 23,
                section: "user",
                type: "currency",
                level: "delete"
            },
            {
                id: 17,
                section: "user",
                type: "currency",
                level: "view"
            }];
        $scope.typeOptionsObj = {
            ACCOUNT : 'account',
            ADDRESS : 'address',
            CURRENCY : 'currency',
            BANK_ACCOUNT : 'bankaccount',
            COMPANY : 'company',
            CRYPTO_ACCOUNT : 'cryptoaccount',
            DOCUMENT : 'document',
            EMAIL : 'email',
            GROUP: 'group',
            MFA : 'mfa',
            MOBILE : 'mobile',
            NOTIFICATION : 'notification',
            REQUEST : 'request',
            SERVICE : 'service',
            TOKEN : 'token',
            TRANSACTION : 'transaction',
            TRANSACTION_SUBTYPES : 'transactionsubtypes',
            USER : 'user',
            WEBHOOK : 'webhook'
        };

        vm.initializePermissions = function () {
            $scope.totalPermissionsObj.adminPermissionsOptions = {
                permissionsName: 'Admin permissions',
                section: 'admin',
                enableAll: false,
                permissionCounter: 0,
                permissions: [
                    {type:'Account',section: 'admin',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]},
                    {type:'Address',section: 'admin',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]},
                    {type:'Currency',section: 'admin',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]},
                    {type:'Bank account',section: 'admin',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]},
                    {type:'Company',section: 'admin',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]},
                    {type:'Crypto account',section: 'admin',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]},
                    {type:'Document',section: 'admin',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]},
                    {type:'Email',section: 'admin',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]},
                    {type:'Group',section: 'admin',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]},
                    {type:'Mfa',section: 'admin',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]},
                    {type:'Mobile',section: 'admin',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]},
                    {type:'Notification',section: 'admin',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]},
                    {type:'Request',section: 'admin',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]},
                    {type:'Service',section: 'admin',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]},
                    {type:'Token',section: 'admin',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]},
                    {type:'Transaction',section: 'admin',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]},
                    {type:'Transaction subtypes',section: 'admin',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]},
                    {type:'User',section: 'admin',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]},
                    {type:'Webhook',section: 'admin',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]}
                ]};

            $scope.totalPermissionsObj.userPermissionsOptions = {
                permissionsName: 'User permissions',
                section: 'user',
                enableAll: false,
                permissionCounter: 0,
                permissions: [
                    {type:'Account',section: 'user',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]},
                    {type:'Address',section: 'user',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]},
                    {type:'Currency',section: 'user',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]},
                    {type:'Bank account',section: 'user',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]},
                    {type:'Company',section: 'user',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]},
                    {type:'Crypto account',section: 'user',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]},
                    {type:'Document',section: 'user',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]},
                    {type:'Email',section: 'user',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]},
                    {type:'Group',section: 'user',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]},
                    {type:'Mfa',section: 'user',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]},
                    {type:'Mobile',section: 'user',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]},
                    {type:'Notification',section: 'user',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]},
                    {type:'Request',section: 'user',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]},
                    {type:'Service',section: 'user',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]},
                    {type:'Token',section: 'user',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]},
                    {type:'Transaction',section: 'user',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]},
                    {type:'Transaction subtypes',section: 'user',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]},
                    {type:'User',section: 'user',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]},
                    {type:'Webhook',section: 'user',levelCounter: 0,levels: [{name: 'view',enabled: false},{name: 'add',enabled: false},{name: 'change',enabled: false},{name: 'delete',enabled: false},{name: 'all',enabled: false}]}
                ]};
        };
        vm.initializePermissions();

        vm.getPermissions = function () {
            if(vm.token) {
                $scope.loadingPermissions = true;
                Rehive.admin.users.permissions.get(vm.uuid,{filters: {page_size: 250}}).then(function (res) {
                    res.results = vm.mockPermissionsResults;
                    $scope.loadingPermissions = false;
                    vm.checkforAllowedPermissions(res.results);
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingPermissions = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.getPermissions();

        vm.checkforAllowedPermissions = function (permissionsArray) {
            permissionsArray.forEach(function (permission,index) {
                Object.keys($scope.totalPermissionsObj).forEach(function(key) {
                    if($scope.totalPermissionsObj[key].section == permission.section){
                        $scope.totalPermissionsObj[key].permissions.forEach(function (element,permissionsIndex) {
                            if(permission.type.toLowerCase() == element.type.toLowerCase()){
                                element.levels.forEach(function (level,levelIndex) {
                                    if(permission.level == level.name){
                                        $scope.totalPermissionsObj[key].permissions[permissionsIndex].levels[levelIndex].enabled = true;
                                        $scope.totalPermissionsObj[key].permissions[permissionsIndex].levels[levelIndex].id = permissionsArray[index].id;
                                        $scope.totalPermissionsObj[key].permissions[permissionsIndex].levelCounter = $scope.totalPermissionsObj[key].permissions[permissionsIndex].levelCounter + 1;
                                        if($scope.totalPermissionsObj[key].permissions[permissionsIndex].levelCounter === 4){
                                            var allIndex = $scope.totalPermissionsObj[key].permissions[permissionsIndex].levels.findIndex(function (element) {
                                                return element.name == 'all';
                                            });
                                            $scope.totalPermissionsObj[key].permissions[permissionsIndex].levels[allIndex].enabled = true;
                                        }

                                        $scope.totalPermissionsObj[key].permissionCounter = $scope.totalPermissionsObj[key].permissionCounter + 1;
                                        if($scope.totalPermissionsObj[key].permissionCounter == (($scope.totalPermissionsObj[key].permissions.length) * 4)){
                                            $scope.totalPermissionsObj[key].enableAll = true;
                                        }
                                    }
                                });
                            }
                        });
                    }
                });
            });
        };

        $scope.toggleAllPermissions = function (key,enabledAll) {
            $scope.totalPermissionsObj[key].permissions.forEach(function (permission) {
                permission.levels.forEach(function (level) {
                    if(level.name === 'all'){
                        level.enabled = enabledAll;
                        $scope.trackPermissions(permission,level,key);
                    }
                });
            });
        };

        $scope.trackPermissions = function (permission,level,permissionOptionKey) {

            //using id as a flag to see whether they have come from the backend or not

            var findIndexOfLevel = function (permissionObj,levelObj) {
                var index;
                if(vm.checkedLevels.length == 0){
                    return -1;
                }

                index = vm.checkedLevels.findIndex(function (element) {
                    return (element.type == permissionObj.type && element.level == levelObj.name);
                });

                return index;
            };

            //if all is selected

            if(level.name == 'all'){
                if(level.enabled){
                    permission.levels.forEach(function (permissionsLevel) {
                        if(!permissionsLevel.id && !permissionsLevel.enabled){
                            permissionsLevel.enabled = true;
                            vm.checkedLevels.push({type: permission.type,level: permissionsLevel.name,section: permission.section});
                            permission.levelCounter = 4;
                            $scope.totalPermissionsObj[permissionOptionKey].permissionCounter = $scope.totalPermissionsObj[permissionOptionKey].permissionCounter + 1;
                            if($scope.totalPermissionsObj[permissionOptionKey].permissionCounter == ($scope.totalPermissionsObj[permissionOptionKey].permissions.length * 4)){
                                $scope.totalPermissionsObj[permissionOptionKey].enableAll = true;
                            }
                        } else if(permissionsLevel.id && !permissionsLevel.enabled){
                            permissionsLevel.enabled = true;
                            var index = findIndexOfLevel(permission,permissionsLevel);
                            vm.checkedLevels.splice(index,1);
                            permission.levelCounter = 4;
                            $scope.totalPermissionsObj[permissionOptionKey].permissionCounter = $scope.totalPermissionsObj[permissionOptionKey].permissionCounter + 1;
                            if($scope.totalPermissionsObj[permissionOptionKey].permissionCounter == ($scope.totalPermissionsObj[permissionOptionKey].permissions.length * 4)){
                                $scope.totalPermissionsObj[permissionOptionKey].enableAll = true;
                            }
                        }
                    });
                } else {
                    permission.levels.forEach(function (permissionsLevel) {
                        if(permissionsLevel.id  && permissionsLevel.enabled){
                            permissionsLevel.enabled = false;
                            vm.checkedLevels.push({type: permission.type,level: permissionsLevel.name,id: permissionsLevel.id,section: permission.section});
                            permission.levelCounter = 0;
                            $scope.totalPermissionsObj[permissionOptionKey].permissionCounter = $scope.totalPermissionsObj[permissionOptionKey].permissionCounter - 1;
                            if($scope.totalPermissionsObj[permissionOptionKey].permissionCounter < ($scope.totalPermissionsObj[permissionOptionKey].permissions.length * 4)){
                                $scope.totalPermissionsObj[permissionOptionKey].enableAll = false;
                            }
                        } else if(!permissionsLevel.id  && permissionsLevel.enabled) {
                            permissionsLevel.enabled = false;
                            var index = findIndexOfLevel(permission,permissionsLevel);
                            vm.checkedLevels.splice(index,1);
                            permission.levelCounter = 0;
                            $scope.totalPermissionsObj[permissionOptionKey].permissionCounter = $scope.totalPermissionsObj[permissionOptionKey].permissionCounter - 1;
                            if($scope.totalPermissionsObj[permissionOptionKey].permissionCounter < ($scope.totalPermissionsObj[permissionOptionKey].permissions.length * 4)){
                                $scope.totalPermissionsObj[permissionOptionKey].enableAll = false;
                            }
                        }
                    });
                }

            } else {

                //level.enabled && level.id means they were ticked from before

                if(level.enabled && level.id){
                    var index = findIndexOfLevel(permission,level);
                    if(index > -1){
                        vm.checkedLevels.splice(index,1);
                        permission.levelCounter = permission.levelCounter + 1;
                        if(permission.levelCounter === 4){
                            var allIndex = permission.levels.findIndex(function (element) {
                                return element.name == 'all';
                            });
                            permission.levels[allIndex].enabled = true;
                        }
                        $scope.totalPermissionsObj[permissionOptionKey].permissionCounter = $scope.totalPermissionsObj[permissionOptionKey].permissionCounter + 1;
                        if($scope.totalPermissionsObj[permissionOptionKey].permissionCounter == ($scope.totalPermissionsObj[permissionOptionKey].permissions.length * 4)){
                            $scope.totalPermissionsObj[permissionOptionKey].enableAll = true;
                        }
                        return;
                    } else {
                        vm.checkedLevels.push({type: permission.type,level: level.name,id: level.id,section: permission.section});
                        permission.levelCounter = permission.levelCounter - 1;
                        if(permission.levelCounter < 4){
                            var allIndex = permission.levels.findIndex(function (element) {
                                return element.name == 'all';
                            });
                            permission.levels[allIndex].enabled = false;
                        }
                        $scope.totalPermissionsObj[permissionOptionKey].permissionCounter = $scope.totalPermissionsObj[permissionOptionKey].permissionCounter - 1;
                        if($scope.totalPermissionsObj[permissionOptionKey].permissionCounter < ($scope.totalPermissionsObj[permissionOptionKey].permissions.length * 4)){
                            $scope.totalPermissionsObj[permissionOptionKey].enableAll = false;
                        }
                        return;
                    }
                } else if(!level.enabled && level.id){
                    var index = findIndexOfLevel(permission,level);
                    if(index > -1){
                        vm.checkedLevels.splice(index,1);
                        permission.levelCounter = permission.levelCounter + 1;
                        if(permission.levelCounter === 4){
                            var allIndex = permission.levels.findIndex(function (element) {
                                return element.name == 'all';
                            });
                            permission.levels[allIndex].enabled = true;
                        }
                        $scope.totalPermissionsObj[permissionOptionKey].permissionCounter = $scope.totalPermissionsObj[permissionOptionKey].permissionCounter + 1;
                        if($scope.totalPermissionsObj[permissionOptionKey].permissionCounter == ($scope.totalPermissionsObj[permissionOptionKey].permissions.length * 4)){
                            $scope.totalPermissionsObj[permissionOptionKey].enableAll = true;
                        }
                        return;
                    } else {
                        vm.checkedLevels.push({type: permission.type,level: level.name,id: level.id,section: permission.section});
                        permission.levelCounter = permission.levelCounter - 1;
                        if(permission.levelCounter < 4){
                            var allIndex = permission.levels.findIndex(function (element) {
                                return element.name == 'all';
                            });
                            permission.levels[allIndex].enabled = false;
                        }
                        $scope.totalPermissionsObj[permissionOptionKey].permissionCounter = $scope.totalPermissionsObj[permissionOptionKey].permissionCounter - 1;
                        if($scope.totalPermissionsObj[permissionOptionKey].permissionCounter < ($scope.totalPermissionsObj[permissionOptionKey].permissions.length * 4)){
                            $scope.totalPermissionsObj[permissionOptionKey].enableAll = false;
                        }
                        return;
                    }
                }

                //only level.enabled means they were not ticked from before

                if(level.enabled){
                    vm.checkedLevels.push({type: permission.type,level: level.name,section: permission.section});
                    permission.levelCounter = permission.levelCounter + 1;
                    if(permission.levelCounter === 4){
                        var allIndex = permission.levels.findIndex(function (element) {
                            return element.name == 'all';
                        });
                        permission.levels[allIndex].enabled = true;
                    }
                    $scope.totalPermissionsObj[permissionOptionKey].permissionCounter = $scope.totalPermissionsObj[permissionOptionKey].permissionCounter + 1;
                    if($scope.totalPermissionsObj[permissionOptionKey].permissionCounter == ($scope.totalPermissionsObj[permissionOptionKey].permissions.length * 4)){
                        $scope.totalPermissionsObj[permissionOptionKey].enableAll = true;
                    }
                } else {
                    var index = findIndexOfLevel(permission,level);
                    vm.checkedLevels.splice(index,1);
                    permission.levelCounter = permission.levelCounter - 1;
                    if(permission.levelCounter < 4){
                        var allIndex = permission.levels.findIndex(function (element) {
                            return element.name == 'all';
                        });
                        permission.levels[allIndex].enabled = false;
                    }
                    $scope.totalPermissionsObj[permissionOptionKey].permissionCounter = $scope.totalPermissionsObj[permissionOptionKey].permissionCounter - 1;
                    if($scope.totalPermissionsObj[permissionOptionKey].permissionCounter < ($scope.totalPermissionsObj[permissionOptionKey].permissions.length * 4)){
                        $scope.totalPermissionsObj[permissionOptionKey].enableAll = false;
                    }
                }
            }
        };

        $scope.savePermissionsProcess = function(){
            console.log(vm.checkedLevels);
            return

            vm.checkedLevels.forEach(function(element,idx,array){
                $scope.loadingPermissions = true;
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
                Rehive.admin.users.permissions.create(vm.uuid, newPermissionObj).then(function (res) {
                    if(last){
                        vm.finishSavingPermissionsProcess();
                        $scope.$apply();
                    }
                }).then(function (res) {
                    if(last){
                        vm.finishSavingPermissionsProcess();
                        $scope.$apply();
                    }
                }, function (error) {
                    vm.checkedLevels = [];
                    $scope.permissionParams = {
                        type: 'Account'
                    };
                    $scope.loadingPermissions = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        vm.deletePermission = function (permission,last) {
            if(vm.token) {
                $scope.loadingPermissions = true;
                Rehive.admin.users.permissions.delete(vm.uuid,permission.id).then(function (res) {
                    if(last){
                        vm.finishSavingPermissionsProcess();
                        $scope.$apply();
                    }
                }, function (error) {
                    $scope.loadingPermissions = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        vm.finishSavingPermissionsProcess = function () {
            vm.initializePermissions();
            $timeout(function () {
                $scope.loadingPermissions = false;
                vm.checkedLevels = [];
                toastr.success('Permissions successfully saved');
                vm.getPermissions();
            },2500);
        };

    }
})();