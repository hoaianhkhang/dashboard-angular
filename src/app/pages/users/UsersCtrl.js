(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users')
        .controller('UsersCtrl', UsersCtrl);

    /** @ngInject */
    function UsersCtrl($rootScope,$state,$scope,environmentConfig,$http,typeaheadService,$location,
                       cookieManagement,errorHandler,$window,toastr,serializeFiltersService) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
        $rootScope.dashboardTitle = 'Users | Rehive';
        vm.currenciesList = JSON.parse($window.sessionStorage.currenciesList || '[]');
        vm.location = $location.path();
        vm.locationArray = vm.location.split('/');
        $scope.locationIndicator = vm.locationArray[vm.locationArray.length - 1];
        $scope.usersStateMessage = '';
        $scope.users = [];
        $scope.usersData = {};
        $scope.showingFilters = false;
        $scope.dateFilterOptions = ['Is in the last','In between','Is equal to','Is after','Is before'];
        $scope.dateFilterIntervalOptions = ['days','months'];
        $scope.statusOptions = ['Status','Pending', 'Obsolete', 'Declined', 'Verified', 'Incomplete'];
        $scope.orderByOptions = ['Joined date','Last login date'];
        $scope.groupFilterOptions = ['Group name','In a group'];
        $scope.currencyOptions = [];
        $scope.filtersCount = 0;

        $scope.usersPagination = {
            itemsPerPage: 25,
            pageNo: 1,
            maxSize: 5
        };

        $scope.filtersObj = {
            identifierFilter: false,
            emailFilter: false,
            mobileFilter: false,
            firstNameFilter: false,
            lastNameFilter: false,
            accountReferenceFilter: false,
            groupFilter: false,
            currencyFilter: false,
            joinedDateFilter: false,
            lastLoginDateFilter: false,
            kycFilter:  false,
            pageSizeFilter: false
        };
        $scope.applyFiltersObj = {
            identifierFilter: {
                selectedIdentifier: ''
            },
            emailFilter: {
                selectedEmail: $state.params.email || ''
            },
            mobileFilter: {
                selectedMobile: $state.params.mobile || ''
            },
            firstNameFilter: {
                selectedFirstName: ''
            },
            lastNameFilter: {
                selectedLastName: ''
            },
            accountReferenceFilter: {
                selectedAccountReference: ''
            },
            groupFilter: {
                selectedGroupOption: 'Group name',
                existsInGroup: false,
                selectedGroup: {}
            },
            currencyFilter: {
                selectedCurrency: {}
            },
            joinedDateFilter: {
                selectedDateOption: 'Is in the last',
                selectedDayIntervalOption: 'days',
                dayInterval: '',
                dateFrom: '',
                dateTo: '',
                dateEqualTo: ''
            },
            lastLoginDateFilter: {
                selectedDateOption: 'Is in the last',
                selectedDayIntervalOption: 'days',
                dayInterval: '',
                dateFrom: '',
                dateTo: '',
                dateEqualTo: ''
            },
            kycFilter: {
                selectedKycFilter: 'Status'
            },
            orderByFilter: {
                selectedOrderByOption: 'Joined date'
            }
        };

        $scope.getGroups = function () {
            if(vm.token) {
                $http.get(environmentConfig.API + '/admin/groups/?page_size=250', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        if(res.data.data.results.length > 0){
                            $scope.groupOptions = res.data.data.results;
                            $scope.applyFiltersObj.groupFilter.selectedGroup = $scope.groupOptions[0];
                        }
                    }
                }).catch(function (error) {
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        $scope.getGroups();

        vm.getCompanyCurrencies = function(){
            //adding currency as default value in both results array and ng-model of currency
            vm.currenciesList.splice(0,0,{code: 'Currency'});
            $scope.applyFiltersObj.currencyFilter.selectedCurrency.code = 'Currency';
            $scope.currencyOptions = vm.currenciesList;
        };
        vm.getCompanyCurrencies();

        if($state.params.currencyCode){
            $scope.filtersObj.currencyFilter = true;
            vm.currenciesList.forEach(function (element) {
                if(element.code == $state.params.currencyCode){
                    $scope.applyFiltersObj.currencyFilter.selectedCurrency = element;
                }
            });
        }

        if($state.params.email){
            $scope.filtersObj.emailFilter = true;
        }

        if($state.params.mobile){
            $scope.filtersObj.mobileFilter = true;
        }

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
        // end

        $scope.getUsersEmailTypeahead = typeaheadService.getUsersEmailTypeahead();
        $scope.getUsersMobileTypeahead = typeaheadService.getUsersMobileTypeahead();

        $scope.showFilters = function () {
            $scope.showingFilters = !$scope.showingFilters;
        };

        $scope.clearFilters = function () {
            $scope.filtersObj = {
                identifierFilter: false,
                emailFilter: false,
                mobileFilter: false,
                firstNameFilter: false,
                lastNameFilter: false,
                accountReferenceFilter: false,
                groupFilter: false,
                currencyFilter: false,
                joinedDateFilter: false,
                lastLoginDateFilter: false,
                kycFilter:  false,
                pageSizeFilter: false
            };
        };

        $scope.joinedDayIntervalChanged = function () {
            if($scope.applyFiltersObj.joinedDateFilter.dayInterval <= 0){
                toastr.success('Please enter a positive value');
            }
        };

        $scope.lastLoginDayIntervalChanged = function () {
            if($scope.applyFiltersObj.lastLoginDateFilter.dayInterval <= 0){
                toastr.success('Please enter a positive value');
            }
        };

        $scope.pageSizeChanged =  function () {
            if($scope.usersPagination.itemsPerPage > 250){
                $scope.usersPagination.itemsPerPage = 250;
            }
        };

        $scope.orderByFunction = function () {
            return ($scope.applyFiltersObj.orderByFilter.selectedOrderByOption == 'Joined date' ? '-date_joined' : '-last_login');
        };

        vm.getJoinedDateFilters = function () {
            var dateObj = {
                date_joined__lt: null,
                date_joined__gt: null
            };

            switch($scope.applyFiltersObj.joinedDateFilter.selectedDateOption) {
                case 'Is in the last':
                    if($scope.applyFiltersObj.joinedDateFilter.selectedDayIntervalOption == 'days'){
                        dateObj.date_joined__lt = moment().add(1,'days').format('YYYY-MM-DD');
                        dateObj.date_joined__gt = moment().subtract($scope.applyFiltersObj.joinedDateFilter.dayInterval,'days').format('YYYY-MM-DD');
                    } else {
                        dateObj.date_joined__lt = moment().add(1,'days').format('YYYY-MM-DD');
                        dateObj.date_joined__gt = moment().subtract($scope.applyFiltersObj.joinedDateFilter.dayInterval,'months').format('YYYY-MM-DD');
                    }

                    break;
                case 'In between':
                    dateObj.date_joined__lt = moment(new Date($scope.applyFiltersObj.joinedDateFilter.dateTo)).add(1,'days').format('YYYY-MM-DD');
                    dateObj.date_joined__gt = moment(new Date($scope.applyFiltersObj.joinedDateFilter.dateFrom)).format('YYYY-MM-DD');

                    break;
                case 'Is equal to':
                    dateObj.date_joined__lt = moment(new Date($scope.applyFiltersObj.joinedDateFilter.dateEqualTo)).add(1,'days').format('YYYY-MM-DD');
                    dateObj.date_joined__gt = moment(new Date($scope.applyFiltersObj.joinedDateFilter.dateEqualTo)).format('YYYY-MM-DD');

                    break;
                case 'Is after':
                    dateObj.date_joined__lt = null;
                    dateObj.date_joined__gt = moment(new Date($scope.applyFiltersObj.joinedDateFilter.dateFrom)).add(1,'days').format('YYYY-MM-DD');
                    break;
                case 'Is before':
                    dateObj.date_joined__lt = moment(new Date($scope.applyFiltersObj.joinedDateFilter.dateTo)).format('YYYY-MM-DD');
                    dateObj.date_joined__gt = null;
                    break;
                default:
                    break;
            }

            return dateObj;
        };

        vm.getLastLoginDateFilters = function () {
            var dateObj = {
                last_login__lt: null,
                last_login__gt: null
            };

            switch($scope.applyFiltersObj.lastLoginDateFilter.selectedDateOption) {
                case 'Is in the last':
                    if($scope.applyFiltersObj.lastLoginDateFilter.selectedDayIntervalOption == 'days'){
                        dateObj.last_login__lt = moment().add(1,'days').format('YYYY-MM-DD');
                        dateObj.last_login__gt = moment().subtract($scope.applyFiltersObj.lastLoginDateFilter.dayInterval,'days').format('YYYY-MM-DD');
                    } else {
                        dateObj.last_login__lt = moment().add(1,'days').format('YYYY-MM-DD');
                        dateObj.last_login__gt = moment().subtract($scope.applyFiltersObj.lastLoginDateFilter.dayInterval,'months').format('YYYY-MM-DD');
                    }

                    break;
                case 'In between':
                    dateObj.last_login__lt = moment(new Date($scope.applyFiltersObj.lastLoginDateFilter.dateTo)).add(1,'days').format('YYYY-MM-DD');
                    dateObj.last_login__gt = moment(new Date($scope.applyFiltersObj.lastLoginDateFilter.dateFrom)).format('YYYY-MM-DD');

                    break;
                case 'Is equal to':
                    dateObj.last_login__lt = moment(new Date($scope.applyFiltersObj.lastLoginDateFilter.dateEqualTo)).add(1,'days').format('YYYY-MM-DD');
                    dateObj.last_login__gt = moment(new Date($scope.applyFiltersObj.lastLoginDateFilter.dateEqualTo)).format('YYYY-MM-DD');

                    break;
                case 'Is after':
                    dateObj.last_login__lt = null;
                    dateObj.last_login__gt = moment(new Date($scope.applyFiltersObj.lastLoginDateFilter.dateFrom)).add(1,'days').format('YYYY-MM-DD');
                    break;
                case 'Is before':
                    dateObj.last_login__lt = moment(new Date($scope.applyFiltersObj.lastLoginDateFilter.dateTo)).format('YYYY-MM-DD');
                    dateObj.last_login__gt = null;
                    break;
                default:
                    break;
            }

            return dateObj;
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

            if($scope.filtersObj.joinedDateFilter){
                vm.dateObj = vm.getJoinedDateFilters();
            } else{
                vm.dateObj = {
                    date_joined__gt: null,
                    date_joined__lt: null
                };
            }

            if($scope.filtersObj.lastLoginDateFilter){
                vm.lastLogindateObj = vm.getLastLoginDateFilters();
            } else{
                vm.lastLogindateObj = {
                    last_login__gt: null,
                    last_login__lt: null
                };
            }


            var searchObj = {
                page: $scope.usersPagination.pageNo,
                page_size: $scope.filtersObj.pageSizeFilter? $scope.usersPagination.itemsPerPage : 25,
                identifier__contains: $scope.filtersObj.identifierFilter ? ($scope.applyFiltersObj.identifierFilter.selectedIdentifier ?  $scope.applyFiltersObj.identifierFilter.selectedIdentifier : null): null,
                email__contains: $scope.filtersObj.emailFilter ?($scope.applyFiltersObj.emailFilter.selectedEmail ?  encodeURIComponent($scope.applyFiltersObj.emailFilter.selectedEmail) : null): null,
                mobile_number__contains: $scope.filtersObj.mobileFilter ? ($scope.applyFiltersObj.mobileFilter.selectedMobile ?  encodeURIComponent($scope.applyFiltersObj.mobileFilter.selectedMobile) : null): null,
                first_name__contains: $scope.filtersObj.firstNameFilter ? ($scope.applyFiltersObj.firstNameFilter.selectedFirstName ?  $scope.applyFiltersObj.firstNameFilter.selectedFirstName : null): null,
                last_name__contains: $scope.filtersObj.lastNameFilter ? ($scope.applyFiltersObj.lastNameFilter.selectedLastName ?  $scope.applyFiltersObj.lastNameFilter.selectedLastName : null): null,
                account: $scope.filtersObj.accountReferenceFilter ? ($scope.applyFiltersObj.accountReferenceFilter.selectedAccountReference ?  $scope.applyFiltersObj.accountReferenceFilter.selectedAccountReference : null): null,
                group: $scope.filtersObj.groupFilter ? $scope.applyFiltersObj.groupFilter.selectedGroupOption == 'Group name'? $scope.applyFiltersObj.groupFilter.selectedGroup.name: null : null,
                group__isnull: $scope.filtersObj.groupFilter ? $scope.applyFiltersObj.groupFilter.selectedGroupOption == 'In a group'? (!$scope.applyFiltersObj.groupFilter.existsInGroup).toString(): null : null,
                date_joined__gt: vm.dateObj.date_joined__gt ? Date.parse(vm.dateObj.date_joined__gt +'T00:00:00') : null,
                date_joined__lt: vm.dateObj.date_joined__lt ? Date.parse(vm.dateObj.date_joined__lt +'T00:00:00') : null,
                last_login__gt: vm.lastLogindateObj.last_login__gt ? Date.parse(vm.lastLogindateObj.last_login__gt +'T00:00:00') : null,
                last_login__lt: vm.lastLogindateObj.last_login__lt ? Date.parse(vm.lastLogindateObj.last_login__lt +'T00:00:00') : null,
                kyc__status: $scope.filtersObj.kycFilter ? ($scope.applyFiltersObj.kycFilter.selectedKycFilter == 'Status' ? null : $scope.applyFiltersObj.kycFilter.selectedKycFilter.toLowerCase()): null,
                currency__code: $scope.filtersObj.currencyFilter ? ($scope.applyFiltersObj.currencyFilter.selectedCurrency.code ? ($scope.applyFiltersObj.currencyFilter.selectedCurrency.code == 'Currency' ? null : $scope.applyFiltersObj.currencyFilter.selectedCurrency.code) : null): null
            };

            return environmentConfig.API + '/admin/users/?' + serializeFiltersService.serializeFilters(searchObj);
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

        $scope.goToAddUser = function () {
            $location.path('/users/add');
        };

        $scope.displayUser = function (user) {
            $location.path('/user/' + user.identifier + '/details');
        };

    }
})();