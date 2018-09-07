(function () {
    'use strict';

    angular.module('BlurAdmin.theme.components')
        .controller('PageTopCtrl', PageTopCtrl);

    /** @ngInject */

    function PageTopCtrl($rootScope,$scope,Rehive,localStorageManagement,$state,$timeout,serializeFiltersService,
                         $location,errorHandler,$window,identifySearchInput) {
        var vm = this;

        vm.token = localStorageManagement.getValue('TOKEN');
        vm.unfinishedDashboardTasks = [];
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
            if(currentLocation.indexOf('company/setup') > 0){
                $scope.inCompanySetupViews = true;
            } else {
                $scope.inCompanySetupViews = false;
            }
        };
        vm.checkIfInCompanySetup(vm.currentLocation);

        $scope.hidingSearchBar = function () {
            $scope.hideSearchBar =  true;
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

            var typeOfInput;

            if(identifySearchInput.isMobile(searchString)){
                typeOfInput = 'mobile';
            } else {
                typeOfInput = 'text';
            }

            vm.findUser(searchString,typeOfInput);

        };

        vm.findUser = function (searchString,typeOfInput) {
            $scope.loadingResults = true;
            vm.showSearchBar();
            $scope.searchedTransactions = [];
            var filter;
            if(vm.token){
                if(typeOfInput == 'mobile'){
                    filter = 'mobile__contains';
                } else {
                    filter = 'email__contains';
                }

                var userFilter = { page_size: 2 };
                userFilter[filter] = searchString;

                Rehive.admin.users.get({filters: userFilter}).then(function (res) {
                    $scope.searchedUsers = res.results;
                    if(res.count == 1){
                        vm.findTransactions(res.results[0].email,'user');
                        $scope.$apply();
                    } else {
                        vm.findTransactions(searchString,'id');
                        $scope.$apply();
                    }
                }, function (error) {
                    $scope.loadingResults = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.findTransactions = function (searchString,typeOfInput) {
            var filter;
            if(vm.token){
                if(typeOfInput == 'user'){
                    filter = 'user';
                } else {
                    filter = 'id';
                }

                var transactionsFilter = { page_size: 2 };
                transactionsFilter[filter] = searchString;

                Rehive.admin.transactions.get({filters: transactionsFilter}).then(function (res) {
                    $scope.loadingResults = false;
                    $scope.searchedTransactions = res.results;
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
            if(identifySearchInput.isMobile($scope.searchString)){
                $state.go('users',{mobile: $scope.searchString});
            } else {
                $state.go('users',{email: $scope.searchString});
            }

        };

        $scope.goToTransactionsHistory = function (transaction) {
            $scope.hidingSearchBar();
            if(transaction && transaction.id){
                $state.go('transactions.history',{transactionId: transaction.id});
            } else if($scope.searchedUsers.length > 0) {
                $state.go('transactions.history',{identifier: $scope.searchedUsers[0].id});
            } else {
                $state.go('transactions.history');
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
            localStorageManagement.deleteValue('TOKEN');
            localStorageManagement.deleteValue('token');
            Rehive.removeToken();
            $location.path('/login');
        };
    }

})();
