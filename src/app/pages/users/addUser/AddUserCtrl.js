(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.addUser')
        .controller('AddUserCtrl', AddUserCtrl);

    /** @ngInject */
    function AddUserCtrl($scope,environmentConfig,$location,
                       cookieManagement,errorHandler,Upload,toastr) {

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
            metadata: {},
            timezone: '',
            nationality: "US"
        };


        $scope.addNewUser = function (newUserParams) {
            if(!newUserParams.email && !newUserParams.mobile){
                toastr.error('Please enter a valid email or mobile number');
                return;
            }
            $scope.loadingUsers = true;
            Upload.upload({
                url: environmentConfig.API + '/admin/users/',
                data: newUserParams,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token},
                method: "POST"
            }).then(function (res) {
                if (res.status === 201) {
                    $scope.newUserParams = {
                        nationality: "US"
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
