(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.addUser')
        .controller('AddUserCtrl', AddUserCtrl);

    /** @ngInject */
    function AddUserCtrl($scope,environmentConfig,$location,cleanObject,
                       cookieManagement,errorHandler,$http,Upload,toastr) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
        $scope.showingMoreDetails = false;
        $scope.newUserParams = {
            first_name: '',
            last_name: '',
            email: '',
            mobile: '',
            id_number: '',
            language: '',
            metadata: '',
            timezone: '',
            groups: '',
            nationality: "US"
        };

        vm.getGroups = function () {
            if(vm.token){
                $http.get(environmentConfig.API + '/admin/groups/?page_size=250', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingUsers = false;
                    if (res.status === 200) {
                        $scope.groups = res.data.data.results;
                    }
                }).catch(function (error) {
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
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
            if(!newUserParams.email && !newUserParams.mobile){
                toastr.error('Please enter a valid email or mobile number');
                return;
            }

            if(newUserParams.metadata == ''){
                newUserParams.metadata = {};
            } else {
                if(vm.isJson(newUserParams.metadata)){
                    newUserParams.metadata = JSON.parse(newUserParams.metadata);
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
                    'Authorization': vm.token},
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
