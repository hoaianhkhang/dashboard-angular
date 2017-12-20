(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.ethereumService.ethereumServiceUsers')
        .controller('EthereumServiceUsersCtrl', EthereumServiceUsersCtrl);

    /** @ngInject */
    function EthereumServiceUsersCtrl($scope,$http,typeaheadService,
                                     cookieManagement,errorHandler,serializeFiltersService) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
        vm.serviceUrl = cookieManagement.getCookie('SERVICEURL');
        $scope.usersStateMessage = '';
        $scope.users = [];
        $scope.usersData = {};
        $scope.showingFilters = false;
        $scope.filtersCount = 0;

        $scope.usersPagination = {
            itemsPerPage: 25,
            pageNo: 1,
            maxSize: 5
        };

        $scope.filtersObj = {
            identifierFilter: false,
            emailFilter: false,
            addressFilter: false,
            pageSizeFilter: false
        };
        $scope.applyFiltersObj = {
            identifierFilter: {
                selectedIdentifier: ''
            },
            emailFilter: {
                selectedEmail: ''
            },
            addressFilter: {
                selectedAddress: ''
            }
        };

        $scope.getUsersEmailTypeahead = typeaheadService.getUsersEmailTypeahead();

        $scope.showFilters = function () {
            $scope.showingFilters = !$scope.showingFilters;
        };

        $scope.clearFilters = function () {
            $scope.filtersObj = {
                identifierFilter: false,
                emailFilter: false,
                addressFilter: false,
                pageSizeFilter: false
            };
        };

        $scope.pageSizeChanged =  function () {
            if($scope.usersPagination.itemsPerPage > 250){
                $scope.usersPagination.itemsPerPage = 250;
            }
        };

        vm.getUsersUrl = function(){
            $scope.filtersCount = 0;

            for(var x in $scope.filtersObj){
                if($scope.filtersObj.hasOwnProperty(x)){
                    if($scope.filtersObj[x]){
                        $scope.filtersCount = $scope.filtersCount + 1;
                    }
                }
            }


            var searchObj = {
                page: $scope.usersPagination.pageNo,
                page_size: $scope.usersPagination.itemsPerPage || 1,
                identifier: $scope.filtersObj.identifierFilter ? ($scope.applyFiltersObj.identifierFilter.selectedIdentifier ?  $scope.applyFiltersObj.identifierFilter.selectedIdentifier : null): null,
                email: $scope.filtersObj.emailFilter ?($scope.applyFiltersObj.emailFilter.selectedEmail ?  encodeURIComponent($scope.applyFiltersObj.emailFilter.selectedEmail) : null): null,
                address: $scope.filtersObj.addressFilter ? ($scope.applyFiltersObj.addressFilter.selectedAddress ?  $scope.applyFiltersObj.addressFilter.selectedAddress: null) : null
            };

            return vm.serviceUrl + 'admin/users/?' + serializeFiltersService.serializeFilters(searchObj);
        };

        $scope.getAllUsers = function(applyFilter){
            $scope.usersStateMessage = '';
            $scope.loadingUsers = true;
            $scope.showingFilters = false;

            if(applyFilter){
                $scope.usersPagination.pageNo = 1;
            }

            if($scope.users.length > 0 ){
                $scope.users.length = 0;
            }

            var usersUrl = vm.getUsersUrl();

            $http.get(usersUrl, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.loadingUsers = false;
                if (res.status === 200) {
                    $scope.usersData = res.data.data;
                    $scope.users = res.data.data.results;
                    if($scope.users.length == 0){
                        $scope.usersStateMessage = 'No users have been found';
                        return;
                    }
                    $scope.usersStateMessage = '';
                }
            }).catch(function (error) {
                $scope.loadingUsers = false;
                $scope.usersStateMessage = 'Failed to load data';
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };
        $scope.getAllUsers();

    }
})();
