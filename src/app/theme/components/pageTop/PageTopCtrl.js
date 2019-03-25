(function () {
    'use strict';

    angular.module('BlurAdmin.theme.components')
        .controller('PageTopCtrl', PageTopCtrl);

    /** @ngInject */

    function PageTopCtrl($rootScope,$scope,Rehive,localStorageManagement,$state,$timeout,serializeFiltersService,
                         $location,errorHandler,$window,identifySearchInput,$intercom) {
        var vm = this;

        vm.token = localStorageManagement.getValue('TOKEN');
        vm.unfinishedDashboardTasks = [];
        vm.searchBox = document.getElementById("searchBox");
        vm.companyIdentifier = localStorageManagement.getValue('companyIdentifier');
        vm.savedAccountsTableFilters = vm.companyIdentifier + 'accountsTableFilters';
        vm.savedTransactionTableFilters = vm.companyIdentifier + 'transactionTableFilters';
        $scope.currencies = [];
        $scope.hideSearchBar = true;
        $scope.searchString = '';
        $scope.searchedTransactions = [];
        $scope.searchedUsers = [];
        $scope.loadingResults = false;
        $scope.inCompanySetupViews = false;
        $scope.transactionSetsExportingInProgress = false;
        $scope.loadingTransactionSets = false;
        $scope.inProgressSets = false;
        $scope.dashboardTasksLists = [];
        $scope.showingDashboardTasks = false;
        $scope.showingDashboardBelow1200Tasks = false;
        $scope.allTasksDone = true;
        $scope.pagination = {
            itemsPerPage: 10,
            pageNo: 1,
            maxSize: 5
        };
        $scope.displayOptions = false;
        $scope.selectSearchCategory = [];
        $scope.selectSearchCategory = [
            {name: "account:", placeholder: "account associated with a user or transaction"},
            {name: "email:", placeholder: "email address associated with a user or transaction"},
            {name: "id:", placeholder: "id associated with a transaction"},
            {name: "mobile:", placeholder: "mobile number associated with a user or transaction"}
        ];

        document.onclick = function(event){
            if($scope.displayOptions && event.target !== vm.searchBox){
                $scope.displaySearchOptions();
            }
        };

        $scope.displaySearchOptions = function(){
            $scope.displayOptions = !$scope.displayOptions;
            vm.searchBox.placeholder = "";
            if(!$scope.displayOptions){
                vm.searchBox.placeholder = "Search by email, mobile number or transaction id";
            }
        };

        $scope.searchSelectedOption = function(option){
            $scope.displayOptions = false;
            $scope.searchString = "";
            $scope.searchString += option.name;
            vm.searchBox.focus();
        };

        vm.currentLocation = $location.path();
        $rootScope.$on('$locationChangeStart', function (event,newUrl,oldURl) {
            vm.currentLocation = $location.path();
            vm.checkIfInCompanySetup(vm.currentLocation);
        });

        $scope.goToCreditUser = function (email) {
            $scope.hidingSearchBar();
            $scope.searchString = '';
            var currentPath = $location.path();
            if(currentPath == '/transactions/history'){
                $location.search('userEmail',(email).toString());
                location.reload();
            } else {
                $location.path('/transactions/history').search({userEmail:  (email).toString()});
            }
        };

        //when page refreshed
        if(!$rootScope.pageTopObj.companyObj){
            vm.getCompanyInfo = function () {
                Rehive.admin.company.get().then(function (res) {
                    $rootScope.pageTopObj.companyObj = {};
                    $rootScope.pageTopObj.companyObj = res;
                    localStorageManagement.setValue('companyIdentifier',$rootScope.pageTopObj.companyObj.id);
                    $rootScope.$apply();
                }, function (err) {
                });
            };
            vm.getCompanyInfo();
        }

        if(!$rootScope.pageTopObj.userInfoObj){
            vm.getUserInfo = function () {
                Rehive.user.get().then(function(user){
                    $rootScope.pageTopObj.userInfoObj = {};
                    $rootScope.pageTopObj.userInfoObj = user;
                    $rootScope.$apply();
                },function(err){
                });
            };
            vm.getUserInfo();
        }

        //when page refreshed

        vm.checkIfInCompanySetup = function (currentLocation) {
            if(currentLocation.indexOf('company/setup') > 0 || currentLocation.indexOf('demo') > 0 || currentLocation.indexOf('verification') > 0){
                $scope.inCompanySetupViews = true;
            } else {
                $scope.inCompanySetupViews = false;
            }
        };
        vm.checkIfInCompanySetup(vm.currentLocation);

        $scope.hidingSearchBar = function () {
            $scope.hideSearchBar =  true;
            vm.searchBox.placeholder = "Search by email, mobile number or transaction id";
        };

        vm.showSearchBar = function () {
            $scope.hideSearchBar =  false;
        };

        $scope.viewProfile = function () {
            $location.path('/account-info');
        };

        vm.getCompanyCurrencies = function(){
            if(vm.token){
                Rehive.admin.currencies.get({filters: {
                    archived: false,
                    page_size: 250
                }}).then(function (res) {
                    if(res.results.length > 0){
                        $window.sessionStorage.currenciesList = JSON.stringify(res.results);
                    }
                }, function (error) {
                    if(error.status == 401){
                        $rootScope.gotToken = false;
                        $rootScope.securityConfigured = true;
                        $rootScope.pageTopObj = {};
                        localStorageManagement.deleteValue('TOKEN');
                        localStorageManagement.deleteValue('token');
                        Rehive.removeToken();
                        $location.path('/login');
                    }
                });
            }
        };
        vm.getCompanyCurrencies();

        $scope.searchGlobal = function (searchString) {
            if($scope.loadingResults){
                return;
            }

            if(!searchString){
                $scope.hidingSearchBar();
                return;
            }
            var array = searchString.split(':');
            var typeOfInput = array[0], searchItemString = array[1];
            // if(identifySearchInput.isMobile(searchItemString)){
            //     typeOfInput = 'mobile';
            // } else {
            //     typeOfInput = 'text';
            // }
            // vm.findUser(searchItemString,typeOfInput);
            vm.findUser(searchItemString, typeOfInput);
        };

        vm.findUser = function (searchString,typeOfInput) {
            $scope.loadingResults = true;
            vm.showSearchBar();
            $scope.searchedTransactions = [];
            if(typeOfInput == 'id'){
                vm.findTransactions(searchString, typeOfInput, searchString);
            }
            else{
                var filter;
                if(vm.token){
                    if(typeOfInput == 'mobile'){
                        filter = 'mobile__contains';
                    } else if(typeOfInput == 'email'){
                        filter = 'email__contains';
                    } else if(typeOfInput == 'account'){
                        filter = 'account';
                    }

                    var userFilter = { page_size: 2 };
                    userFilter[filter] = searchString;

                    Rehive.admin.users.get({filters: userFilter}).then(function (res) {
                        $scope.searchedUsers = res.results;
                        if(res.count == 1){
                            vm.findTransactions(res.results[0].email, typeOfInput, searchString);
                            $scope.$apply();
                        } else {
                            vm.findTransactions(searchString, typeOfInput, searchString);
                            $scope.$apply();
                        }
                    }, function (error) {
                        $scope.loadingResults = false;
                        errorHandler.evaluateErrors(error);
                        errorHandler.handleErrors(error);
                    });
                }
            }
        };

        vm.findTransactions = function (searchString, typeOfInput, originalString) {
            var filter;
            $scope.searchedAccounts = [];
            if(vm.token){
                if(typeOfInput == 'email'){
                    filter = 'user';
                } else if(typeOfInput == 'id'){
                    filter = 'id';
                } else if(typeOfInput == 'account'){
                    filter = 'account';
                }

                var transactionsFilter = { page_size: 2 };
                if(typeOfInput == 'account'){
                    transactionsFilter[filter] = originalString;
                } else {
                    transactionsFilter[filter] = searchString;
                }

                Rehive.admin.transactions.get({filters: transactionsFilter}).then(function (res) {
                    $scope.loadingResults = false;
                    $scope.searchedTransactions = res.results;

                    if(typeOfInput == 'account' || typeOfInput == 'email'){
                        vm.findAccounts(originalString, typeOfInput);
                    }
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingResults = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.findAccounts = function(searchString, typeOfInput){
            var filter;
            if(vm.token){
                if(typeOfInput == 'email'){
                   filter = 'user';
                } else {
                    filter = 'reference';
                }
                var accountsFilter = { page_size: 2 };
                accountsFilter[filter] = searchString;

                Rehive.admin.accounts.get({filters: accountsFilter}).then(function (res) {
                    $scope.loadingResults = false;
                    $scope.searchedAccounts = res.results;
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingResults = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.goToUserProfile = function (user) {
            $scope.hidingSearchBar();
            $location.path('/user/' + user.id + '/details');
        };

        $scope.goToUsers = function () {
            $scope.hidingSearchBar();
            var type = $scope.searchString.split(':')[0], data = $scope.searchString.split(':')[1];
            if(type == 'mobile'){
                $state.go('users',{mobile: data});
            } else if(type == 'email'){
                $state.go('users',{email: data});
            } else if(type == 'account'){
                $state.go('users',{reference: data});
            } else {
                $state.go('users');
            }
        };

        $scope.goToTransactionsHistory = function (transaction) {
            $scope.hidingSearchBar();
            var type = $scope.searchString.split(':')[0];

            if(transaction){
                if(type == "id"){
                    $state.go('transactions.history',{transactionId: transaction.id});
                }
                else if(type == "email"){
                    var userId = transaction.id + ":" + transaction.user.email;
                    $state.go('transactions.history',{id: userId});
                }
                else if(type == "mobile"){
                    var userId = transaction.id + ":" + transaction.user.id;
                    $state.go('transactions.history',{id: userId});
                }
                else if(type == "account"){
                    var accountRef = transaction.id + ":" + transaction.account;
                    $state.go('transactions.history',{accountRef: accountRef});
                }
            } else {
                var data = $scope.searchString.split(':')[1];
                if(type == "id"){
                    $state.go('transactions.history',{transactionId: data});
                }
                else if(type == "email"){
                    var userId = "0:" + data;
                    $state.go('transactions.history',{id: userId});
                }
                else if(type == "mobile"){
                    var userId = "0:" + data;
                    $state.go('transactions.history',{id: userId});
                }
                else if(type == "account"){
                    var accountRef = "0:" + data;
                    $state.go('transactions.history',{accountRef: accountRef});
                }
            }
        };

        $scope.goToAccounts = function (account) {
            $scope.hidingSearchBar();
            var type = $scope.searchString.split(':')[0];
            if(account){
                if(type == "account"){
                    $state.go('accounts',{accountRef: account.reference});
                }else if(type == "email"){
                    $state.go('accounts',{email: account.user.email});
                }else {
                    $state.go('accounts');
                }
            } else {
                var data = $scope.searchString.split(':')[1];
                if(type == "account"){
                    $state.go('accounts',{accountRef: data});
                }else if(type == "email"){
                    $state.go('accounts',{email: data});
                }else {
                    $state.go('accounts');
                }
            }

        };

        // dashboardTasks start

        $scope.getTransactionSetsFiltersObj = function(){

            var searchObj = {
                page: $scope.pagination.pageNo,
                page_size: $scope.pagination.itemsPerPage
            };

            return serializeFiltersService.objectFilters(searchObj);
        };

        $scope.getTransactionSetsList = function(noLoadingImage){
            if(vm.token) {
                if(!noLoadingImage){
                    $scope.loadingTransactionSets = true;
                }

                $scope.inProgressSets = false;

                var transactionSetsFiltersObj = $scope.getTransactionSetsFiltersObj();

                Rehive.admin.transactions.sets.get({filters: transactionSetsFiltersObj}).then(function (res) {
                    if(res.results.length > 0){
                        vm.unfinishedDashboardTasks.length = 0;
                        $scope.dashboardTasksData = res;
                        $scope.dashboardTasksLists = $scope.dashboardTasksData.results;
                        vm.getFinishedTransactionSets($scope.dashboardTasksLists);
                        $scope.$apply();
                    } else {
                        $scope.loadingTransactionSets = false;
                        $scope.$apply();
                    }
                }, function (error) {
                    $scope.loadingTransactionSets = false;
                    if(error.status == 401){
                        $rootScope.gotToken = false;
                        $rootScope.securityConfigured = true;
                        $rootScope.pageTopObj = {};
                        localStorageManagement.deleteValue('TOKEN');
                        localStorageManagement.deleteValue('token');
                        Rehive.removeToken();
                        $location.path('/login');
                    }
                    $scope.$apply();
                });
            }
        };
        $scope.getTransactionSetsList();

        vm.getFinishedTransactionSets = function (setList) {
            setList.forEach(function (set,index,array) {
                if(index == (array.length - 1)){
                    if(set.progress == 100){
                        vm.getSingleTransactionSet(set,'last');
                        $scope.$apply();
                    } else {
                        // scenario if array length is 1
                        set.untouched = true;
                        vm.unfinishedDashboardTasks.push(set);
                        $scope.inProgressSets = true;
                        vm.getSingleTransactionSet(null,'last');
                        $scope.$apply();
                    }
                } else{
                    if(set.progress == 100){
                        vm.getSingleTransactionSet(set);
                        $scope.$apply();
                    } else {
                        set.untouched = true;
                        vm.unfinishedDashboardTasks.push(set);
                        $scope.inProgressSets = true;
                        $scope.loadingTransactionSets = false;
                        $scope.$apply();
                    }
                }
            });
        };

        vm.getSingleTransactionSet = function (set,last) {
            if(set){
                Rehive.admin.transactions.sets.get({id: set.id}).then(function (res) {
                    set.pages = res.pages;
                    if(last){
                        $scope.loadingTransactionSets = false;
                        if($scope.inProgressSets){
                            $scope.transactionSetsExportingInProgress = true;
                            $scope.allTasksDone = false;
                            $timeout(function () {
                                $scope.checkWhetherTaskCompleteOrNot();
                            },10000);
                            $scope.$apply();
                        } else {
                            $scope.transactionSetsExportingInProgress = false;
                            if($scope.showingDashboardTasks){
                                $scope.allTasksDone = true;
                            }
                            $scope.$apply();
                        }
                    }
                }, function (error) {
                    $scope.loadingTransactionSets = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            } else {
                // scenario if array length is 1

                $scope.loadingTransactionSets = false;
                if($scope.inProgressSets){
                    $scope.transactionSetsExportingInProgress = true;
                    $scope.allTasksDone = false;
                    $timeout(function () {
                        $scope.checkWhetherTaskCompleteOrNot();
                    },10000);
                } else {
                    $scope.transactionSetsExportingInProgress = false;
                    if($scope.showingDashboardTasks){
                        $scope.allTasksDone = true;
                    }
                }
            }
        };

        $scope.checkWhetherTaskCompleteOrNot = function(){
            if(vm.unfinishedDashboardTasks.length > 0){
                vm.unfinishedDashboardTasks.forEach(function (set,index,array) {
                    if(index == (array.length -1)){
                        Rehive.admin.transactions.sets.get({id: set.id}).then(function (res) {
                            if(res.progress == 100){
                                vm.unfinishedDashboardTasks.splice(index,1);
                                $scope.dashboardTasksLists.forEach(function (element,ind,arr) {
                                    if(element.id == res.id){
                                        res.untouched = true;
                                        $scope.dashboardTasksLists.splice(ind,1,res);
                                        $scope.$apply();
                                    }
                                });
                                if(vm.unfinishedDashboardTasks.length == 0){
                                    $scope.transactionSetsExportingInProgress = false;
                                    if($scope.showingDashboardTasks){
                                        $scope.allTasksDone = true;
                                    }
                                    $scope.$apply();
                                } else {
                                    $timeout(function () {
                                        $scope.checkWhetherTaskCompleteOrNot();
                                    },10000);
                                    $scope.$apply();
                                }
                            } else if((res.progress >= 0) && (res.progress < 100)){
                                $scope.dashboardTasksLists.forEach(function (element,ind,arr) {
                                    if(element.id == res.id){
                                        res.untouched = true;
                                        $scope.dashboardTasksLists.splice(ind,1,res);
                                    }
                                });
                                $timeout(function () {
                                    $scope.checkWhetherTaskCompleteOrNot();
                                },10000);
                                $scope.$apply();
                            }
                        }, function (error) {
                            errorHandler.evaluateErrors(error);
                            errorHandler.handleErrors(error);
                            $scope.$apply();
                        });
                    }
                });
            } else {
                if($scope.showingDashboardTasks){
                    $scope.allTasksDone = true;
                }
            }
        };

        $scope.downloadExportFile = function (file) {
            $window.open(file,'_blank');
        };

        $scope.openDashboardTasks = function () {
            $scope.showingDashboardTasks = !$scope.showingDashboardTasks;
            if($scope.showingDashboardTasks && !$scope.transactionSetsExportingInProgress){
                $scope.allTasksDone = true;
            }
        };

        $scope.openDashboardBelow1200Tasks = function () {
            $scope.showingDashboardBelow1200Tasks = !$scope.showingDashboardBelow1200Tasks;
            if($scope.showingDashboardBelow1200Tasks && !$scope.transactionSetsExportingInProgress){
                $scope.allTasksDone = true;
            }
        };

        $rootScope.$on('exportSetCreate', function(event, obj){
            if(obj.status == 'created'){
                $scope.transactionSetsExportingInProgress = true;
                $scope.getTransactionSetsList();
            }
        });

        $scope.closeDashboardTasksBox = function () {
            $scope.showingDashboardTasks = false;
        };

        $scope.closeDashboardBelow1200TasksBox = function () {
            $scope.showingDashboardBelow1200Tasks = false;
        };

        // dashboardTasks end

        $scope.logout = function(){
            $rootScope.dashboardTitle = 'Rehive';
            $rootScope.gotToken = false;
            $rootScope.securityConfigured = true;
            $window.sessionStorage.currenciesList = '';
            $rootScope.pageTopObj = {};
            $intercom.shutdown();
            localStorageManagement.deleteValue('TOKEN');
            localStorageManagement.deleteValue('token');
            Rehive.removeToken();
            $location.path('/login');
        };
    }

})();
