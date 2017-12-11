(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users')
        .controller('UsersCtrl', UsersCtrl);

    /** @ngInject */
    function UsersCtrl($state,$scope,environmentConfig,$http,typeaheadService,$location,
                       cookieManagement,errorHandler,Upload,$window,toastr,serializeFiltersService) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
        vm.currenciesList = JSON.parse($window.sessionStorage.currenciesList || '[]');
        vm.location = $location.path();
        vm.locationArray = vm.location.split('/');
        $scope.locationIndicator = vm.locationArray[vm.locationArray.length - 1];
        $scope.usersStateMessage = '';
        $scope.users = [];
        $scope.showingFilters = true;

        $scope.usersPagination = {
            itemsPerPage: 25,
            pageNo: 1,
            maxSize: 5
        };

        $scope.usersSearchParams = {
            searchIdentifier:null,
            searchEmail:null,
            searchMobileNumber: null,
            searchFirstName:null,
            searchLastName: null,
            searchCurrency: {},
            searchJoinedDateFrom: null,
            searchJoinedDateTo: null,
            searchLastLoginDateFrom: null,
            searchLastLoginDateTo: null,
            searchKycStatus: 'Status'
        };

        $scope.statusOptions = ['Status','Pending', 'Obsolete', 'Declined', 'Verified', 'Incomplete'];
        $scope.currencyOptions = [];

        //for angular datepicker
        $scope.dateObj = {};
        $scope.dateObj.format = 'MM/dd/yyyy';
        $scope.popup1 = {};
        $scope.open1 = function() {
            $scope.popup1.opened = true;
        };

        $scope.popup2 = {};
        $scope.open2 = function() {
            $scope.popup2.opened = true;
        };

        $scope.popup3 = {};
        $scope.open3 = function() {
            $scope.popup3.opened = true;
        };

        $scope.popup4 = {};
        $scope.open4 = function() {
            $scope.popup4.opened = true;
        };

        $scope.getUsersEmailTypeahead = typeaheadService.getUsersEmailTypeahead();
        $scope.getUsersMobileTypeahead = typeaheadService.getUsersMobileTypeahead();

        $scope.showFilters = function () {
            $scope.showingFilters = !$scope.showingFilters;
        };

        $scope.clearFilters = function () {
            $scope.usersSearchParams = {
                searchIdentifier:null,
                searchEmail:null,
                searchMobileNumber: null,
                searchFirstName:null,
                searchLastName: null,
                searchCurrency: {code: 'Currency'},
                searchJoinedDateFrom: null,
                searchJoinedDateTo: null,
                searchLastLoginDateFrom: null,
                searchLastLoginDateTo: null,
                searchKycStatus: 'Status'
            };
        };

        vm.getCompanyCurrencies = function(){
            //adding currency as default value in both results array and ng-model of currency
            vm.currenciesList.splice(0,0,{code: 'Currency'});
            $scope.usersSearchParams.searchCurrency.code = 'Currency';
            $scope.currencyOptions = vm.currenciesList;
        };
        vm.getCompanyCurrencies();

        if($state.params.currencyCode){
            vm.currenciesList.forEach(function (element) {
                if(element.code ==  $state.params.currencyCode){
                    $scope.usersSearchParams.searchCurrency = element;
                }
            });
        }

        vm.getUsersUrl = function(){

            var searchObj = {
                page: $scope.usersPagination.pageNo,
                page_size: $scope.usersPagination.itemsPerPage || 1,
                identifier__contains:($scope.usersSearchParams.searchIdentifier ?  $scope.usersSearchParams.searchIdentifier : null),
                email__contains:($scope.usersSearchParams.searchEmail ?  encodeURIComponent($scope.usersSearchParams.searchEmail) : null),
                mobile_number__contains:($scope.usersSearchParams.searchMobileNumber ?  encodeURIComponent($scope.usersSearchParams.searchMobileNumber) : null),
                first_name__contains:($scope.usersSearchParams.searchFirstName ?  $scope.usersSearchParams.searchFirstName : null),
                last_name__contains:($scope.usersSearchParams.searchLastName ?  $scope.usersSearchParams.searchLastName : null),
                date_joined__gt:($scope.usersSearchParams.searchJoinedDateFrom? Date.parse($scope.usersSearchParams.searchJoinedDateFrom) : null),
                date_joined__lt:($scope.usersSearchParams.searchJoinedDateTo? Date.parse($scope.usersSearchParams.searchJoinedDateTo) : null),
                last_login__gt:($scope.usersSearchParams.searchLastLoginDateFrom? Date.parse($scope.usersSearchParams.searchLastLoginDateFrom) : null),
                last_login__lt: ($scope.usersSearchParams.searchLastLoginDateTo? Date.parse($scope.usersSearchParams.searchLastLoginDateTo) : null),
                kyc__status:($scope.usersSearchParams.searchKycStatus == 'Status' ? null : $scope.usersSearchParams.searchKycStatus.toLowerCase()),
                currency__code: ($scope.usersSearchParams.searchCurrency.code ? ($scope.usersSearchParams.searchCurrency.code == 'Currency' ? null : $scope.usersSearchParams.searchCurrency.code) : null)
            };

            return environmentConfig.API + '/admin/users/?' + serializeFiltersService.serializeFilters(searchObj);
        };

        $scope.getAllUsers = function(applyFilter){
            $scope.usersStateMessage = '';
            $scope.loadingUsers = true;

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
