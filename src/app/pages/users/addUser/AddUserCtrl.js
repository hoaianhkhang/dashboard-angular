(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.addUser')
        .controller('AddUserCtrl', AddUserCtrl);

    /** @ngInject */
    function AddUserCtrl($scope,Rehive,environmentConfig,$location,cleanObject,
                         localStorageManagement,errorHandler,Upload,toastr) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        $scope.showingMoreDetails = false;
        $scope.newUserParams = {
            first_name: '',
            last_name: '',
            email: '',
            mobile_number: '',
            id_number: '',
            language: '',
            metadata: '',
            timezone: '',
            groups: '',
            nationality: "US"
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
                newUserParams.metadata = {};
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

            Upload.upload({
                url: environmentConfig.API + '/admin/users/',
                data: cleanUserParams,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Token ' + vm.token},
                method: "POST"
            }).then(function (res) {
                if (res.status === 201) {
                    $scope.newUserParams = {
                        nationality: "US",
                        metadata: ''
                    };
                    $scope.backToUsers();
                    toastr.success('User successfully added');
                }
            }).catch(function (error) {
                $scope.loadingUsers = false;
                newUserParams.metadata = JSON.stringify(newUserParams.metadata);
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
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
