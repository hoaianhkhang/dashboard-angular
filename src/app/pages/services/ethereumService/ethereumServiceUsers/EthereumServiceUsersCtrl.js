(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.ethereumService.ethereumServiceUsers')
        .controller('EthereumServiceUsersCtrl', EthereumServiceUsersCtrl);

    /** @ngInject */
    function EthereumServiceUsersCtrl($rootScope, $scope,$http,typeaheadService,
                                      localStorageManagement,errorHandler,serializeFiltersService) {

        var vm = this, extensionsList = JSON.parse(localStorageManagement.getValue('extensionsList'));
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.serviceUrl = extensionsList[6];
        // vm.serviceUrl = "https://ethereum.services.rehive.io/api/1/";
        // $rootScope.dashboardTitle = 'Ethereum service | Rehive';
        $rootScope.dashboardTitle = 'Ethereum extension | Rehive';
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
            idFilter: false,
            emailFilter: false,
            addressFilter: false,
            pageSizeFilter: false
        };
        $scope.applyFiltersObj = {
            idFilter: {
                selectedId: ''
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
                idFilter: false,
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
                page_size: $scope.filtersObj.pageSizeFilter? $scope.usersPagination.itemsPerPage : 25,
                id: $scope.filtersObj.idFilter ? ($scope.applyFiltersObj.idFilter.selectedId ?  $scope.applyFiltersObj.idFilter.selectedId : null): null,
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
