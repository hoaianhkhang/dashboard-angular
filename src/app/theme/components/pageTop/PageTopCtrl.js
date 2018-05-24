(function () {
    'use strict';

    angular.module('BlurAdmin.theme.components')
        .controller('PageTopCtrl', PageTopCtrl);

    /** @ngInject */
    function PageTopCtrl($rootScope,$scope,localStorageManagement,$state,Rehive,
                         $location,errorHandler,$window,identifySearchInput) {
        var vm = this;

        vm.token = localStorageManagement.getValue('token');
        $scope.currencies = [];
        $scope.hideSearchBar = true;
        $scope.searchString = '';
        $scope.searchedTransactions = [];
        $scope.searchedUsers = [];
        $scope.loadingResults = false;
        $scope.inCompanySetupViews = false;

        vm.currentLocation = $location.path();
        $rootScope.$on('$locationChangeStart', function (event,newUrl,oldURl) {
            vm.currentLocation = $location.path();
            vm.checkIfInCompanySetup(vm.currentLocation);
        });

        $scope.goToCreditUser = function (email) {
            $scope.hidingSearchBar();
            $location.path('/transactions/history').search({userEmail:  (email).toString()});
        };

        //when page refreshed
        if(!$rootScope.pageTopObj.companyObj){
            vm.getCompanyInfo = function () {
                if(vm.token) {
                    Rehive.admin.company.get().then(function (res) {
                        $rootScope.pageTopObj.companyObj = {};
                        $rootScope.pageTopObj.companyObj = res;
                        localStorageManagement.setValue('companyIdentifier',$rootScope.pageTopObj.companyObj.identifier);
                        $rootScope.$apply();
                    }, function (err) {
                    });
                }
            };
            vm.getCompanyInfo();
        }

        if(!$rootScope.pageTopObj.userInfoObj){
            vm.getUserInfo = function () {
                if(vm.token) {
                    Rehive.user.get().then(function(user){
                        $rootScope.pageTopObj.userInfoObj = {};
                        $rootScope.pageTopObj.userInfoObj = user;
                        $rootScope.$apply();
                    },function(err){
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
                Rehive.admin.currencies.get({filters: {
                    enabled: true,
                    page_size: 250
                }}).then(function (res) {
                    if(res.results.length > 0){
                        $window.sessionStorage.currenciesList = JSON.stringify(res.results);
                    }
                }, function (error) {
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
                    filter = 'mobile_number__contains';
                } else {
                    filter = 'email__contains';
                }

                var userFilter = { page_size: 2 };
                userFilter[filter] = searchString;

                Rehive.admin.users.get({filters: userFilter}).then(function (res) {
                    $scope.searchedUsers = res.results;
                    $scope.$apply();
                    if(res.count == 1){
                        vm.findTransactions(res.results[0].email,'user');
                    } else {
                        vm.findTransactions(searchString,'id');
                    }
                }, function (error) {
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

        $scope.logout = function(){
            $rootScope.dashboardTitle = 'Rehive';
            $rootScope.gotToken = false;
            $rootScope.securityConfigured = true;
            $window.sessionStorage.currenciesList = '';
            $rootScope.pageTopObj = {};
            $rootScope.userFullyVerified = false;
            localStorageManagement.deleteValue('TOKEN');
            localStorageManagement.deleteValue('token');
            $location.path('/login');
        };
    }

})();
