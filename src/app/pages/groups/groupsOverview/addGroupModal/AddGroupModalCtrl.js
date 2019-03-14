(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groups.overview')
        .controller('AddGroupsModalCtrl', AddGroupsModalCtrl);


    function AddGroupsModalCtrl($scope,Rehive,$uibModalInstance,$filter,localStorageManagement,errorHandler) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        $scope.addingGroups = false;
        $scope.groupsParams = {};
        vm.savedGroupColors = [];
        vm.colorIndex = -1;
        vm.companyColors = localStorageManagement.getValue('companyIdentifier') + "_group_colors";
        vm.color_picker = document.getElementById('addGroupColor');

        vm.initializeGroupHighlightColor = function(){
            $scope.groupsParams.group_highlight = {
                group: null,
                color: "#022b36"
            };
        };
        vm.initializeGroupHighlightColor();

        vm.prepareUserPermissions = function(){
            $scope.userPermissions = [
                {type:'account', level: "view", section: 'user'},
                {type:'address', level: "view", section: 'user'},
                {type:'bankaccount', level: "view", section: 'user'},
                {type:'currency', level: "view", section: 'user'},
                {type:'company', level: "view", section: 'user'},
                {type:'cryptoaccount', level: "view", section: 'user'},
                {type:'document', level: "view", section: 'user'},
                {type:'email', level: "view", section: 'user'},
                {type:'group', level: "view", section: 'user'},
                {type:'mfa', level: "view", section: 'user'},
                {type:'mobile', level: "view", section: 'user'},
                {type:'token', level: "view", section: 'user'},
                {type:'transaction', level: "view", section: 'user'},
                {type:'user', level: "view", section: 'user'}
            ];
            var len = $scope.userPermissions.length;
            for(var i = 0; i < len; ++i){
                $scope.userPermissions.push({type: $scope.userPermissions[i].type, level: "add", section: 'user'});
                $scope.userPermissions.push({type: $scope.userPermissions[i].type, level: "change", section: 'user'});
                $scope.userPermissions.push({type: $scope.userPermissions[i].type, level: "delete", section: 'user'});
            }
        };
        vm.prepareUserPermissions();

        $scope.trackColorChange = function(){
            // $scope.groupsParams.group_highlight.color = vm.color_picker.value;

        };

        vm.addGroupHighlightColor = function(){
            console.log($scope.groupsParams.group_highlight.color);

            if($scope.groupsParams.name == "service" || $scope.groupsParams.name == "admin"){
                return;
            }

            $scope.groupsParams.group_highlight.group = $scope.groupsParams.name;
            vm.savedGroupColors = localStorageManagement.getValue(vm.companyColors) ? JSON.parse(localStorageManagement.getValue(vm.companyColors)) : [];
            vm.savedGroupColors.forEach(function(color){
                if(color.group === $scope.groupsParams.name){
                    vm.colorIndex = vm.savedGroupColors.indexOf(color);
                    return;
                }
            });
            if(vm.colorIndex === -1){
                vm.savedGroupColors.push($scope.groupsParams.group_highlight);
            }else{
                vm.savedGroupColors[vm.colorIndex].color = $scope.groupsParams.group_highlight.color;
            }
            localStorageManagement.setValue(vm.companyColors, JSON.stringify(vm.savedGroupColors));
        };


        $scope.groupNameToLowercase = function () {
            if($scope.groupsParams.name){
                $scope.groupsParams.name = $scope.groupsParams.name.toLowerCase();
                $scope.groupsParams.label = $filter('capitalizeWord')($scope.groupsParams.name);
            } else {
                $scope.groupsParams.label = '';
            }
        };

        vm.addGroupPermissions = function(groupName){
            if(vm.token) {
                Rehive.admin.groups.permissions.create(groupName,{permissions: $scope.userPermissions}).then(function (res) {
                    $scope.addingGroups = false;
                    vm.addGroupHighlightColor();
                    $scope.groupsParams = {};
                    $uibModalInstance.close(res);
                    $scope.$apply();
                }, function (error) {
                    $scope.groupsParams = {};
                    $scope.addingGroups = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        $scope.addGroup = function (groupsParams) {
            if(vm.token) {
                $scope.addingGroups = true;
                Rehive.admin.groups.create(groupsParams).then(function (res) {
                    vm.addGroupPermissions(res.name);
                    $scope.$apply();
                }, function (error) {
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

    }
})();
