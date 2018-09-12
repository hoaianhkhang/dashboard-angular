(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.addUser')
        .controller('AddUserCtrl', AddUserCtrl);

    /** @ngInject */
    function AddUserCtrl($scope,Rehive,$location,cleanObject,
                         localStorageManagement,errorHandler,toastr) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        $scope.showingMoreDetails = false;
        $scope.newUserParams = {
            first_name: '',
            last_name: '',
            username: '',
            email: '',
            mobile: '',
            id_number: '',
            language: '',
            metadata: '',
            timezone: '',
            groups: '',
            nationality: "US"
        };

        $scope.fixformat = function(){
            $scope.newUserParams.username = $scope.newUserParams.username.toLowerCase();
            $scope.newUserParams.username = $scope.newUserParams.username.replace(/ /g, '_');
        };

        vm.getGroups = function () {
            if(vm.token){
                Rehive.admin.groups.get({filters: {page_size: 250}}).then(function (res) {
                    $scope.loadingUsers = false;
                    $scope.groups = res.results;
                    $scope.$apply();
                }, function (error) {
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.getGroups();

        vm.isJson = function (str) {
            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }
            return true;
        };

        $scope.addNewUser = function (newUserParams) {
            if(newUserParams.metadata == ''){
                newUserParams.metadata = '{}';
            } else {
                if(vm.isJson(newUserParams.metadata)){
                    newUserParams.metadata = newUserParams.metadata;
                } else {
                    toastr.error('Invalid metadata format');
                    return;
                }
            }

            $scope.loadingUsers = true;

            if(newUserParams.groups && newUserParams.groups.name){
                newUserParams.groups = newUserParams.groups.name;
            }

            var cleanUserParams = cleanObject.cleanObj(newUserParams);

            var formData = new FormData();

            for(var key in cleanUserParams) {
                if (cleanUserParams.hasOwnProperty(key)) {
                    formData.append(key, cleanUserParams[key]);
                }
            }

            Rehive.admin.users.create(formData).then(function (res) {
                $scope.newUserParams = {
                    nationality: "US",
                    metadata: ''
                };
                $scope.backToUsers();
                toastr.success('User successfully added');
                $scope.$apply();
            }, function (error) {
                $scope.loadingUsers = false;
                newUserParams.metadata = JSON.stringify(newUserParams.metadata);
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });

        };

        $scope.toggleMoreDetails = function () {
            $scope.showingMoreDetails = !$scope.showingMoreDetails;
        };

        $scope.backToUsers = function () {
            $location.path('/users');
        };

    }
})();
