(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users')
        .controller('UsersCtrl', UsersCtrl);

    /** @ngInject */
    function UsersCtrl($rootScope,$state,Rehive,$scope,typeaheadService,$location,$uibModal,
                       localStorageManagement,errorHandler,$window,toastr,serializeFiltersService,$filter) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.companyIdentifier = localStorageManagement.getValue('companyIdentifier');
        $scope.companyDateFormatString = localStorageManagement.getValue('DATE_FORMAT');
        vm.savedUserTableColumns = vm.companyIdentifier + 'usersTable';
        vm.savedUserTableFilters = vm.companyIdentifier + 'usersTableFilters';
        $rootScope.dashboardTitle = 'Users | Rehive';
        vm.currenciesList = JSON.parse($window.sessionStorage.currenciesList || '[]');
        vm.location = $location.path();
        vm.locationArray = vm.location.split('/');
        $scope.locationIndicator = vm.locationArray[vm.locationArray.length - 1];
        $scope.usersStateMessage = '';
        $scope.users = [];
        $scope.usersData = {};
        $scope.showingFilters = false;
        $scope.showingColumnFilters = false;
        $scope.dateFilterOptions = ['Is in the last','In between','Is equal to','Is after','Is before'];
        $scope.dateFilterIntervalOptions = ['days','months'];
        $scope.archivedOptions = ['True','False'];
        $scope.statusOptions = ['Status','Pending', 'Obsolete', 'Declined', 'Verified', 'Incomplete'];
        $scope.orderByOptions = ['Created','Last login date'];
        $scope.groupFilterOptions = ['User group','In a group'];
        $scope.currencyOptions = [];
        $scope.filtersCount = 0;
        $scope.initialLoad = true;
        $scope.orderByVariable = '-createdJSTime';

        $scope.usersPagination = {
            itemsPerPage: 25,
            pageNo: 1,
            maxSize: 5
        };

        // if(localStorageManagement.getValue(vm.savedUserTableColumns)){
        //     var headerColumns = JSON.parse(localStorageManagement.getValue(vm.savedUserTableColumns));
        //     var recipientFieldExists = false;
        //     headerColumns.forEach(function (col) {
        //         if(col.colName == 'Archived' || col.fieldName == 'archived'){
        //             recipientFieldExists = true;
        //         }
        //     });
        //
        //     if(!recipientFieldExists){
        //         headerColumns.splice(8,0,{colName: 'Archived',fieldName: 'archived',visible: false});
        //     }
        //
        //     localStorageManagement.setValue(vm.savedUserTableColumns,JSON.stringify(headerColumns));
        // }

        //removing active field
        if(localStorageManagement.getValue(vm.savedUserTableColumns)){
             var headerColumns = JSON.parse(localStorageManagement.getValue(vm.savedUserTableColumns));
             headerColumns.forEach(function (col,index,array) {
                 if(col.colName == 'Identifier'){
                     col.colName = 'Id';
                     col.fieldName = 'id';
                 }
             });

            localStorageManagement.setValue(vm.savedUserTableColumns,JSON.stringify(headerColumns));
        }

        $scope.headerColumns = localStorageManagement.getValue(vm.savedUserTableColumns) ? JSON.parse(localStorageManagement.getValue(vm.savedUserTableColumns)) : [
            {colName: 'Id',fieldName: 'id',visible: true},
            {colName: 'First name',fieldName: 'first_name',visible: true},
            {colName: 'Last name',fieldName: 'last_name',visible: true},
            {colName: 'Email',fieldName: 'email',visible: true},
            {colName: 'Mobile number',fieldName: 'mobile',visible: true},
            {colName: 'User group',fieldName: 'groupName',visible: true},
            {colName: 'Created',fieldName: 'created',visible: true},
            {colName: 'Updated',fieldName: 'updated',visible: false},
            {colName: 'Archived',fieldName: 'archived',visible: false},
            {colName: 'Status',fieldName: 'status',visible: false},
            {colName: 'KYC status',fieldName: 'kycStatus',visible: false},
            {colName: 'Last login',fieldName: 'last_login',visible: false},
            {colName: 'Verified',fieldName: 'verified',visible: false},
            {colName: 'ID Number',fieldName: 'id_number',visible: false},
            {colName: 'Nationality',fieldName: 'nationality',visible: false},
            {colName: 'Language',fieldName: 'language',visible: false},
            {colName: 'Timezone',fieldName: 'timezone',visible: false},
            {colName: 'Birth date',fieldName: 'birth_date',visible: false},
            {colName: 'Username',fieldName: 'username',visible: false}
        ];
        $scope.filtersObj = {
            archivedFilter: false,
            idFilter: false,
            emailFilter: false,
            mobileFilter: false,
            firstNameFilter: false,
            lastNameFilter: false,
            accountReferenceFilter: false,
            groupFilter: false,
            currencyFilter: false,
            createdFilter: false,
            updatedFilter: false,
            lastLoginDateFilter: false,
            kycFilter:  false,
            pageSizeFilter: false
        };
        $scope.applyFiltersObj = {
            archivedFilter: {
                selectedArchivedFilter: 'True'
            },
            idFilter: {
                selectedId: ''
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
                selectedGroupOption: 'User group',
                existsInGroup: false,
                selectedGroup: {}
            },
            currencyFilter: {
                selectedCurrency: {}
            },
            createdFilter: {
                selectedDateOption: 'Is in the last',
                selectedDayIntervalOption: 'days',
                dayInterval: '',
                dateFrom: '',
                dateTo: '',
                dateEqualTo: ''
            },
            updatedFilter: {
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
                selectedOrderByOption: 'Created'
            },
            paginationFilter: {
                itemsPerPage: 25,
                pageNo: 1,
                maxSize: 5
            }
        };

        $scope.showColumnFilters = function () {
            $scope.showingFilters = false;
            $scope.showingColumnFilters = !$scope.showingColumnFilters;
        };

        $scope.selectAllColumns = function () {
            $scope.headerColumns.forEach(function (headerObj) {
                headerObj.visible = true;
            });
            localStorageManagement.setValue(vm.savedUserTableColumns,JSON.stringify($scope.headerColumns));
        };

        $scope.toggleColumnVisibility = function () {
            localStorageManagement.setValue(vm.savedUserTableColumns,JSON.stringify($scope.headerColumns));
        };

        $scope.restoreColDefaults = function () {
            var defaultVisibleHeader = ['Id','First name','Last name','Email',
                'Mobile number','User group','Created'];

            $scope.headerColumns.forEach(function (headerObj) {
                if(defaultVisibleHeader.indexOf(headerObj.colName) > -1){
                    headerObj.visible = true;
                } else {
                    headerObj.visible = false;
                }
            });

            localStorageManagement.setValue(vm.savedUserTableColumns,JSON.stringify($scope.headerColumns));
        };

        $scope.getGroups = function () {
            if(vm.token) {
                Rehive.admin.groups.get({filters: {page_size: 250}}).then(function (res) {
                    if(res.results.length > 0){
                        $scope.groupOptions = res.results;
                        $scope.applyFiltersObj.groupFilter.selectedGroup = $scope.groupOptions[0];
                        $scope.getAllUsers();
                    } else {
                        $scope.getAllUsers();
                    }
                    $scope.$apply();
                }, function (error) {
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        vm.getCompanyCurrencies = function(){
            //adding currency as default value in both results array and ng-model of currency
            vm.currenciesList.splice(0,0,{code: 'Currency'});
            $scope.currencyOptions = vm.currenciesList;
            $scope.getGroups();
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
        $scope.dateObj.format = $scope.companyDateFormatString;
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

        $scope.popup5 = {};
        $scope.open5 = function() {
            $scope.popup5.opened = true;
        };

        $scope.popup6 = {};
        $scope.open6 = function() {
            $scope.popup6.opened = true;
        };
        // end

        $scope.getUsersEmailTypeahead = typeaheadService.getUsersEmailTypeahead();
        $scope.getUsersMobileTypeahead = typeaheadService.getUsersMobileTypeahead();

        $scope.showFilters = function () {
            $scope.showingFilters = !$scope.showingFilters;
            $scope.showingColumnFilters = false;
        };

        $scope.clearFilters = function () {
            $scope.filtersObj = {
                archivedFilter: false,
                idFilter: false,
                emailFilter: false,
                mobileFilter: false,
                firstNameFilter: false,
                lastNameFilter: false,
                accountReferenceFilter: false,
                groupFilter: false,
                currencyFilter: false,
                createdFilter: false,
                updatedFilter: false,
                lastLoginDateFilter: false,
                kycFilter:  false,
                pageSizeFilter: false
            };
        };

        $scope.createdIntervalChanged = function () {
            if($scope.applyFiltersObj.createdFilter.dayInterval <= 0){
                toastr.success('Please enter a positive value');
            }
        };

        $scope.updatedIntervalChanged = function () {
            if($scope.applyFiltersObj.updatedFilter.dayInterval <= 0){
                toastr.success('Please enter a positive value');
            }
        };

        $scope.lastLoginDayIntervalChanged = function () {
            if($scope.applyFiltersObj.lastLoginDateFilter.dayInterval <= 0){
                toastr.success('Please enter a positive value');
            }
        };

        $scope.pageSizeChanged =  function () {
            if($scope.applyFiltersObj.paginationFilter.itemsPerPage > 250){
                $scope.applyFiltersObj.paginationFilter.itemsPerPage = 250;
            }
        };

        $scope.orderByFunction = function (header) {
            if(header.orderByDirection == 'desc'){
                header.orderByDirection = 'asc';
                $scope.orderByVariable = header.fieldName;
            } else {
                header.orderByDirection = 'desc';
                $scope.orderByVariable = '-' + header.fieldName;
                localStorageManagement.setValue(vm.savedUserTableColumns,JSON.stringify($scope.headerColumns));
            }
        };

        vm.getCreatedDateFilters = function () {
            var dateObj = {
                created__lt: null,
                created__gt: null
            };

            switch($scope.applyFiltersObj.createdFilter.selectedDateOption) {
                case 'Is in the last':
                    if($scope.applyFiltersObj.createdFilter.selectedDayIntervalOption == 'days'){
                        dateObj.created__lt = moment().add(1,'days').format('YYYY-MM-DD');
                        dateObj.created__gt = moment().subtract($scope.applyFiltersObj.createdFilter.dayInterval,'days').format('YYYY-MM-DD');
                    } else {
                        dateObj.created__lt = moment().add(1,'days').format('YYYY-MM-DD');
                        dateObj.created__gt = moment().subtract($scope.applyFiltersObj.createdFilter.dayInterval,'months').format('YYYY-MM-DD');
                    }

                    break;
                case 'In between':
                    dateObj.created__lt = moment(new Date($scope.applyFiltersObj.createdFilter.dateTo)).add(1,'days').format('YYYY-MM-DD');
                    dateObj.created__gt = moment(new Date($scope.applyFiltersObj.createdFilter.dateFrom)).format('YYYY-MM-DD');

                    break;
                case 'Is equal to':
                    dateObj.created__lt = moment(new Date($scope.applyFiltersObj.createdFilter.dateEqualTo)).add(1,'days').format('YYYY-MM-DD');
                    dateObj.created__gt = moment(new Date($scope.applyFiltersObj.createdFilter.dateEqualTo)).format('YYYY-MM-DD');

                    break;
                case 'Is after':
                    dateObj.created__lt = null;
                    dateObj.created__gt = moment(new Date($scope.applyFiltersObj.createdFilter.dateFrom)).add(1,'days').format('YYYY-MM-DD');
                    break;
                case 'Is before':
                    dateObj.created__lt = moment(new Date($scope.applyFiltersObj.createdFilter.dateTo)).format('YYYY-MM-DD');
                    dateObj.created__gt = null;
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

        vm.getUpdatedDateFilters = function () {
            var dateObj = {
                updated__lt: null,
                updated__gt: null
            };

            switch($scope.applyFiltersObj.updatedFilter.selectedDateOption) {
                case 'Is in the last':
                    if($scope.applyFiltersObj.createdFilter.selectedDayIntervalOption == 'days'){
                        dateObj.updated__lt = moment().add(1,'days').format('YYYY-MM-DD');
                        dateObj.updated__gt = moment().subtract($scope.applyFiltersObj.updatedFilter.dayInterval,'days').format('YYYY-MM-DD');
                    } else {
                        dateObj.updated__lt = moment().add(1,'days').format('YYYY-MM-DD');
                        dateObj.updated__gt = moment().subtract($scope.applyFiltersObj.updatedFilter.dayInterval,'months').format('YYYY-MM-DD');
                    }

                    break;
                case 'In between':
                    dateObj.updated__lt = moment(new Date($scope.applyFiltersObj.updatedFilter.dateTo)).add(1,'days').format('YYYY-MM-DD');
                    dateObj.updated__gt = moment(new Date($scope.applyFiltersObj.updatedFilter.dateFrom)).format('YYYY-MM-DD');

                    break;
                case 'Is equal to':
                    dateObj.updated__lt = moment(new Date($scope.applyFiltersObj.updatedFilter.dateEqualTo)).add(1,'days').format('YYYY-MM-DD');
                    dateObj.updated__gt = moment(new Date($scope.applyFiltersObj.updatedFilter.dateEqualTo)).format('YYYY-MM-DD');

                    break;
                case 'Is after':
                    dateObj.updated__lt = null;
                    dateObj.updated__gt = moment(new Date($scope.applyFiltersObj.updatedFilter.dateFrom)).add(1,'days').format('YYYY-MM-DD');
                    break;
                case 'Is before':
                    dateObj.updated__lt = moment(new Date($scope.applyFiltersObj.updatedFilter.dateTo)).format('YYYY-MM-DD');
                    dateObj.updated__gt = null;
                    break;
                default:
                    break;
            }

            return dateObj;
        };

        vm.getUsersFiltersObj = function(){
            $scope.filtersCount = 0;
            var searchObj = {};
            var filterObjects = {};

            // get saved user table filters on initial load from local storage if any
            if($scope.initialLoad){
                $scope.initialLoad = false;
                if(localStorageManagement.getValue(vm.savedUserTableFilters)){
                    filterObjects = JSON.parse(localStorageManagement.getValue(vm.savedUserTableFilters));

                    $scope.filtersObj = filterObjects.filtersObj;

                    $scope.applyFiltersObj = {
                        archivedFilter: {
                            selectedArchivedFilter: filterObjects.applyFiltersObj.archivedFilter.selectedArchivedFilter
                        },
                        idFilter: {
                            selectedId: filterObjects.applyFiltersObj.idFilter.selectedId
                        },
                        emailFilter: {
                            selectedEmail: $state.params.email || filterObjects.applyFiltersObj.emailFilter.selectedEmail
                        },
                        mobileFilter: {
                            selectedMobile: $state.params.mobile || filterObjects.applyFiltersObj.mobileFilter.selectedMobile
                        },
                        firstNameFilter: {
                            selectedFirstName: filterObjects.applyFiltersObj.firstNameFilter.selectedFirstName
                        },
                        lastNameFilter: {
                            selectedLastName: filterObjects.applyFiltersObj.lastNameFilter.selectedLastName
                        },
                        accountReferenceFilter: {
                            selectedAccountReference: filterObjects.applyFiltersObj.accountReferenceFilter.selectedAccountReference
                        },
                        groupFilter: {
                            selectedGroupOption: filterObjects.applyFiltersObj.groupFilter.selectedGroupOption,
                            existsInGroup: filterObjects.applyFiltersObj.groupFilter.existsInGroup,
                            selectedGroup: filterObjects.applyFiltersObj.groupFilter.selectedGroup.name ?
                                $scope.groupOptions.find(function (group) {
                                    if(group.name == filterObjects.applyFiltersObj.groupFilter.selectedGroup.name){
                                        return group;
                                    }
                                }) : $scope.groupOptions[0]
                        },
                        currencyFilter: {
                            selectedCurrency: filterObjects.applyFiltersObj.currencyFilter.selectedCurrency.code ? filterObjects.applyFiltersObj.currencyFilter.selectedCurrency : filterObjects.applyFiltersObj.currencyFilter.selectedCurrency = { code: 'Currency' }
                        },
                        createdFilter: {
                            selectedDateOption: filterObjects.applyFiltersObj.createdFilter.selectedDateOption,
                            selectedDayIntervalOption: filterObjects.applyFiltersObj.createdFilter.selectedDayIntervalOption,
                            dayInterval: filterObjects.applyFiltersObj.createdFilter.dayInterval,
                            dateFrom: moment(filterObjects.applyFiltersObj.createdFilter.dateFrom).toDate(),
                            dateTo: moment(filterObjects.applyFiltersObj.createdFilter.dateTo).toDate(),
                            dateEqualTo: moment(filterObjects.applyFiltersObj.createdFilter.dateEqualTo).toDate()
                        },
                        updatedFilter: {
                            selectedDateOption: filterObjects.applyFiltersObj.updatedFilter.selectedDateOption,
                            selectedDayIntervalOption: filterObjects.applyFiltersObj.updatedFilter.selectedDayIntervalOption,
                            dayInterval: filterObjects.applyFiltersObj.updatedFilter.dayInterval,
                            dateFrom: moment(filterObjects.applyFiltersObj.updatedFilter.dateFrom).toDate(),
                            dateTo: moment(filterObjects.applyFiltersObj.updatedFilter.dateTo).toDate(),
                            dateEqualTo: moment(filterObjects.applyFiltersObj.updatedFilter.dateEqualTo).toDate()
                        },
                        lastLoginDateFilter: {
                            selectedDateOption: filterObjects.applyFiltersObj.lastLoginDateFilter.selectedDateOption,
                            selectedDayIntervalOption: filterObjects.applyFiltersObj.lastLoginDateFilter.selectedDayIntervalOption,
                            dayInterval: filterObjects.applyFiltersObj.lastLoginDateFilter.dayInterval,
                            dateFrom: moment(filterObjects.applyFiltersObj.lastLoginDateFilter.dateFrom).toDate(),
                            dateTo: moment(filterObjects.applyFiltersObj.lastLoginDateFilter.dateTo).toDate(),
                            dateEqualTo: moment(filterObjects.applyFiltersObj.lastLoginDateFilter.dateEqualTo).toDate()
                        },
                        kycFilter: {
                            selectedKycFilter: filterObjects.applyFiltersObj.kycFilter.selectedKycFilter
                        },
                        orderByFilter: {
                            selectedOrderByOption: filterObjects.applyFiltersObj.orderByFilter.selectedOrderByOption
                        },
                        paginationFilter: {
                            itemsPerPage: filterObjects.applyFiltersObj.paginationFilter.itemsPerPage,
                            pageNo: filterObjects.applyFiltersObj.paginationFilter.pageNo,
                            maxSize: filterObjects.applyFiltersObj.paginationFilter.maxSize
                        }
                    };

                    searchObj = filterObjects.searchObj;
                } else {
                    searchObj = {
                        page: 1,
                        page_size: $scope.filtersObj.pageSizeFilter? $scope.applyFiltersObj.paginationFilter.itemsPerPage : 25
                    };
                }

            } else {

                if($scope.filtersObj.createdFilter){
                    vm.dateObj = vm.getCreatedDateFilters();
                } else{
                    vm.dateObj = {
                        created__gt: null,
                        created__lt: null
                    };
                }

                if($scope.filtersObj.updatedFilter){
                    vm.updatedDateObj = vm.getUpdatedDateFilters();
                } else{
                    vm.updatedDateObj = {
                        updated__gt: null,
                        updated__lt: null
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

                searchObj = {
                    page: $scope.applyFiltersObj.paginationFilter.pageNo,
                    page_size: $scope.filtersObj.pageSizeFilter? $scope.applyFiltersObj.paginationFilter.itemsPerPage : 25,
                    id__contains: $scope.filtersObj.idFilter ? ($scope.applyFiltersObj.idFilter.selectedId ?  $scope.applyFiltersObj.idFilter.selectedId : null): null,
                    email__contains: $scope.filtersObj.emailFilter ?($scope.applyFiltersObj.emailFilter.selectedEmail ? $scope.applyFiltersObj.emailFilter.selectedEmail : null): null,
                    mobile__contains: $scope.filtersObj.mobileFilter ? ($scope.applyFiltersObj.mobileFilter.selectedMobile ? $scope.applyFiltersObj.mobileFilter.selectedMobile : null): null,
                    first_name__contains: $scope.filtersObj.firstNameFilter ? ($scope.applyFiltersObj.firstNameFilter.selectedFirstName ?  $scope.applyFiltersObj.firstNameFilter.selectedFirstName : null): null,
                    last_name__contains: $scope.filtersObj.lastNameFilter ? ($scope.applyFiltersObj.lastNameFilter.selectedLastName ?  $scope.applyFiltersObj.lastNameFilter.selectedLastName : null): null,
                    account: $scope.filtersObj.accountReferenceFilter ? ($scope.applyFiltersObj.accountReferenceFilter.selectedAccountReference ?  $scope.applyFiltersObj.accountReferenceFilter.selectedAccountReference : null): null,
                    group: $scope.filtersObj.groupFilter ? $scope.applyFiltersObj.groupFilter.selectedGroupOption == 'User group'? $scope.applyFiltersObj.groupFilter.selectedGroup.name: null : null,
                    group__isnull: $scope.filtersObj.groupFilter ? $scope.applyFiltersObj.groupFilter.selectedGroupOption == 'In a group'? (!$scope.applyFiltersObj.groupFilter.existsInGroup).toString(): null : null,
                    created__gt: vm.dateObj.created__gt ? Date.parse(vm.dateObj.created__gt +'T00:00:00') : null,
                    created__lt: vm.dateObj.created__lt ? Date.parse(vm.dateObj.created__lt +'T00:00:00') : null,
                    updated__gt: vm.updatedDateObj.updated__gt ? Date.parse(vm.updatedDateObj.updated__gt +'T00:00:00') : null,
                    updated__lt: vm.updatedDateObj.updated__lt ? Date.parse(vm.updatedDateObj.updated__lt +'T00:00:00') : null,
                    last_login__gt: vm.lastLogindateObj.last_login__gt ? Date.parse(vm.lastLogindateObj.last_login__gt +'T00:00:00') : null,
                    last_login__lt: vm.lastLogindateObj.last_login__lt ? Date.parse(vm.lastLogindateObj.last_login__lt +'T00:00:00') : null,
                    kyc__status: $scope.filtersObj.kycFilter ? ($scope.applyFiltersObj.kycFilter.selectedKycFilter == 'Status' ? null : $scope.applyFiltersObj.kycFilter.selectedKycFilter.toLowerCase()): null,
                    currency__code: $scope.filtersObj.currencyFilter ? ($scope.applyFiltersObj.currencyFilter.selectedCurrency.code ? ($scope.applyFiltersObj.currencyFilter.selectedCurrency.code == 'Currency' ? null : $scope.applyFiltersObj.currencyFilter.selectedCurrency.code) : null): null,
                    archived: $scope.filtersObj.archivedFilter ? ($scope.applyFiltersObj.archivedFilter.selectedArchivedFilter == 'True' ?  true : false) : null
                };

                vm.saveUsersTableFiltersToLocalStorage({
                    searchObj: serializeFiltersService.objectFilters(searchObj),
                    filtersObj: $scope.filtersObj,
                    applyFiltersObj: $scope.applyFiltersObj
                });
            }

            for(var x in $scope.filtersObj){
                if($scope.filtersObj.hasOwnProperty(x)){
                    if($scope.filtersObj[x]){
                        $scope.filtersCount = $scope.filtersCount + 1;
                    }
                }
            }

            return serializeFiltersService.objectFilters(searchObj);
        };

        vm.saveUsersTableFiltersToLocalStorage = function (filterObjects) {
            localStorageManagement.setValue(vm.savedUserTableFilters,JSON.stringify(filterObjects));
        };

        vm.getAllUsersApiCall = function (usersFiltersObj) {
            Rehive.admin.users.get({filters: usersFiltersObj}).then(function (res) {
                $scope.usersData = res;
                vm.formatUsersArray(res.results);
                if($scope.users.length == 0){
                    $scope.usersStateMessage = 'No users have been found';
                    $scope.$apply();
                    return;
                }
                $scope.usersStateMessage = '';
                $scope.$apply();
            }, function (error) {
                $scope.loadingUsers = false;
                $scope.usersStateMessage = 'Failed to load data';
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };
        $scope.getAllUsers = function(applyFilter){
            $scope.usersStateMessage = '';
            $scope.loadingUsers = true;
            $scope.showingFilters = false;
            var usersFiltersObj = {};

            if(applyFilter){
                $scope.applyFiltersObj.paginationFilter.pageNo = 1;
            }

            if($scope.users.length > 0 ){
                $scope.users.length = 0;
            }

            usersFiltersObj = vm.getUsersFiltersObj();
            vm.getAllUsersApiCall(usersFiltersObj);

        };

        vm.formatUsersArray = function (usersArray) {
            usersArray.forEach(function (userObj) {
                $scope.users.push({
                    id: userObj.id,
                    first_name: userObj.first_name,
                    last_name: userObj.last_name,
                    email: userObj.email,
                    mobile: userObj.mobile,
                    groupName: userObj.groups.length > 0 ? userObj.groups[0].name: null,
                    created: userObj.created ? $filter("date")(userObj.created,'mediumDate') + ' ' + $filter("date")(userObj.created,'shortTime'): null,
                    updated: userObj.updated ? $filter("date")(userObj.updated,'mediumDate') + ' ' + $filter("date")(userObj.updated,'shortTime'): null,
                    archived: $filter("capitalizeWord")(userObj.archived),
                    status: $filter("capitalizeWord")(userObj.status),
                    kycStatus: $filter("capitalizeWord")(userObj.kyc.status),
                    last_login: userObj.last_login ? $filter("date")(userObj.last_login,'mediumDate') + ' ' + $filter("date")(userObj.last_login,'shortTime'): null,
                    verified: userObj.verified ? 'Yes' : 'No',
                    id_number: userObj.id_number,
                    nationality: userObj.nationality ? $filter("isoCountry")(userObj.nationality): null,
                    language: userObj.language,
                    timezone: userObj.timezone,
                    birth_date: userObj.birth_date,
                    username: userObj.username,
                    createdJSTime: userObj.created
                });
            });

            $scope.loadingUsers = false;
            $scope.$apply();
        };

        $scope.openAddUserModal = function (page, size) {
            vm.theAddModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'AddUserModalCtrl'
            });

            vm.theAddModal.result.then(function(user){
                if(user){
                    $scope.getAllUsers();
                }
            }, function(){
            });

        };

        $scope.displayUser = function ($event,user) {
            if($event.which === 1){
                $location.path('/user/' + user.id + '/details');
            } else if($event.which === 2){
                $window.open('/#/user/' + user.id + '/details','_blank');
            } else if($event.which === 3){
                $window.open('/#/user/' + user.id + '/details','_blank');
            }
        };

        $scope.closeColumnFiltersBox = function () {
            $scope.showingColumnFilters = false;
        };

    }
})();