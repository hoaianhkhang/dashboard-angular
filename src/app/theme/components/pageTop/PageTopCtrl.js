(function () {
    'use strict';

    angular.module('BlurAdmin.theme.components')
        .controller('PageTopCtrl', PageTopCtrl);

    /** @ngInject */
    function PageTopCtrl($rootScope,$scope,$http,localStorageManagement,$state,$timeout,serializeFiltersService,
                         environmentConfig,$location,errorHandler,$window,identifySearchInput) {
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
                if(vm.token) {
                    $http.get(environmentConfig.API + '/admin/company/', {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': vm.token
                        }
                    }).then(function (res) {
                        if (res.status === 200) {
                            $rootScope.pageTopObj.companyObj = {};
                            $rootScope.pageTopObj.companyObj = res.data.data;
                            localStorageManagement.setValue('companyIdentifier',$rootScope.pageTopObj.companyObj.identifier);
                        }
                    }).catch(function (error) {
                    });
                }
            };
            vm.getCompanyInfo();
        }

        if(!$rootScope.pageTopObj.userInfoObj){
            vm.getUserInfo = function () {
                if(vm.token) {
                    $http.get(environmentConfig.API + '/user/', {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': vm.token
                        }
                    }).then(function (res) {
                        if (res.status === 200) {
                            $rootScope.pageTopObj.userInfoObj = {};
                            $rootScope.pageTopObj.userInfoObj = res.data.data;
                        }
                    }).catch(function (error) {
                    });
                }
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
            if($rootScope.pageTopObj.userInfoObj.identifier){
                $location.path('/user/' + $rootScope.pageTopObj.userInfoObj.identifier + '/details');
            }
        };

        vm.getCompanyCurrencies = function(){
            if($rootScope.userFullyVerified && vm.token){
                $http.get(environmentConfig.API + '/admin/currencies/?enabled=true&page_size=250', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        if(res.data.data.results.length > 0){
                            $window.sessionStorage.currenciesList = JSON.stringify(res.data.data.results);
                        }
                    }
                }).catch(function (error) {
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
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
                    filter = 'mobile_number__contains=';
                } else {
                    filter = 'email__contains=';
                }

                $http.get(environmentConfig.API + '/admin/users/?page_size=2&' + filter + encodeURIComponent(searchString), {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $scope.searchedUsers = res.data.data.results;
                        if(res.data.data.count == 1){
                            vm.findTransactions(res.data.data.results[0].email,'user');
                        } else {
                            vm.findTransactions(searchString,'id');
                        }
                    }
                }).catch(function (error) {
                    $scope.loadingResults = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.findTransactions = function (searchString,typeOfInput) {
            var filter;
            if(vm.token){
                if(typeOfInput == 'user'){
                    filter = 'user=';
                } else {
                    filter = 'id=';
                }

                $http.get(environmentConfig.API + '/admin/transactions/?page_size=2&' + filter + encodeURIComponent(searchString), {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $scope.loadingResults = false;
                        $scope.searchedTransactions = res.data.data.results;
                    }
                }).catch(function (error) {
                    $scope.loadingResults = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.goToUserProfile = function (user) {
            $scope.hidingSearchBar();
            $location.path('/user/' + user.identifier + '/details');
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
                $state.go('transactions.history',{identifier: $scope.searchedUsers[0].identifier});
            } else {
                $state.go('transactions.history');
            }
        };

        // dashboardTasks start

        $scope.getTransactionSetsUrl = function(){

            var searchObj = {
                page: $scope.pagination.pageNo,
                page_size: $scope.pagination.itemsPerPage
            };

            return environmentConfig.API + '/admin/transactions/sets/?' + serializeFiltersService.serializeFilters(searchObj);
        };

        $scope.getTransactionSetsList = function(noLoadingImage){
            if(vm.token) {

                if(!noLoadingImage){
                    $scope.loadingTransactionSets = true;
                }

                $scope.inProgressSets = false;

                var transactionSetsUrl = $scope.getTransactionSetsUrl();

                $http.get(transactionSetsUrl, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        if(res.data.data.results.length > 0){
                            $scope.dashboardTasksData = res.data.data;
                            $scope.dashboardTasksLists = $scope.dashboardTasksData.results;
                            vm.getFinishedTransactionSets($scope.dashboardTasksLists);
                        } else {
                            $scope.loadingTransactionSets = false;
                        }
                    }
                }).catch(function (error) {
                    $scope.loadingTransactionSets = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        $scope.getTransactionSetsList();

        vm.getFinishedTransactionSets = function (setList) {
            setList.forEach(function (set,index,array) {
                if(index == (array.length - 1)){
                    if(set.progress == 100){
                        vm.getSingleTransactionSet(set,'last');
                    } else {
                        // scenario if array length is 1
                        vm.unfinishedDashboardTasks.push(set);
                        $scope.inProgressSets = true;
                        vm.getSingleTransactionSet(null,'last');
                    }
                } else{
                    if(set.progress == 100){
                        vm.getSingleTransactionSet(set);
                    } else {
                        vm.unfinishedDashboardTasks.push(set);
                        $scope.inProgressSets = true;
                        $scope.loadingTransactionSets = false;
                    }
                }
            });
        };

        vm.getSingleTransactionSet = function (set,last) {
            if(set){
                $http.get(environmentConfig.API + '/admin/transactions/sets/' + set.id + '/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        set.pages = res.data.data.pages;
                        if(last){
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
                    }
                }).catch(function (error) {
                    $scope.loadingTransactionSets = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
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
                    $http.get(environmentConfig.API + '/admin/transactions/sets/' + set.id + '/', {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': vm.token
                        }
                    }).then(function (res) {
                        if(res.status === 200) {
                            console.log(res.data.data)
                            if(res.data.data.progress == 100){
                                vm.unfinishedDashboardTasks.splice(index,1);
                                $scope.dashboardTasksLists.forEach(function (element) {
                                    if(element.id == res.data.data.id){
                                        element.pages = res.data.data.pages;
                                    }
                                });
                                if(vm.unfinishedDashboardTasks.length == 0){
                                    $scope.allTasksDone = true;
                                }
                            } else {
                                $timeout(function () {
                                    $scope.checkWhetherTaskCompleteOrNot();
                                },10000);
                            }
                        }
                    }).catch(function (error) {
                        errorHandler.evaluateErrors(error.data);
                        errorHandler.handleErrors(error);
                    });
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
            if($scope.showingDashboardTasks){
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

        // dashboardTasks end

        $scope.logout = function(){
            $rootScope.dashboardTitle = 'Rehive';
            $rootScope.gotToken = false;
            $rootScope.securityConfigured = true;
            $window.sessionStorage.currenciesList = '';
            $rootScope.pageTopObj = {};
            $rootScope.userFullyVerified = false;
            localStorageManagement.deleteValue('TOKEN');
            $location.path('/login');
        };
    }

})();
