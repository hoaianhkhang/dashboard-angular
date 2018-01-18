(function () {
    'use strict';

    angular.module('BlurAdmin.theme.components')
        .controller('PageTopCtrl', PageTopCtrl);

    /** @ngInject */
    function PageTopCtrl($rootScope,$scope,$http,cookieManagement,$state,
                         environmentConfig,$location,errorHandler,$window,_,identifySearchInput) {
        var vm = this;

        vm.token = cookieManagement.getCookie('TOKEN');
        $scope.currencies = [];
        $scope.userInfo = {};
        $scope.hideSearchBar = true;
        $scope.searchString = '';
        $scope.searchedTransactions = [];
        $scope.searchedUsers = [];
        $scope.loadingResults = false;

        vm.currentLocation = $location.path();
        $rootScope.$on('$locationChangeStart', function (event,newUrl,oldURl) {
            vm.currentLocation = $location.path();
            vm.callCompanyInfoFunctionIfNotInTheseRoutes(vm.currentLocation);
        });

        $scope.hidingSearchBar = function () {
            $scope.hideSearchBar =  true;
        };

        vm.showSearchBar = function () {
            $scope.hideSearchBar =  false;
        };

        vm.getCompanyInfo = function () {
            if(vm.token) {
                $scope.loadingCompanyInfo = true;
                $http.get(environmentConfig.API + '/admin/company/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingCompanyInfo = false;
                    if (res.status === 200) {
                        $scope.company = res.data.data;
                        $rootScope.companyName = res.data.data.name;
                        vm.getCompanyCurrencies();
                    }
                }).catch(function (error) {
                    $scope.loadingCompanyInfo = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.getUserInfo = function () {
            if(vm.token) {
                $http.get(environmentConfig.API + '/user/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $scope.userInfo = res.data.data;
                    }
                }).catch(function (error) {
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        vm.getUserInfo();

        $scope.viewProfile = function () {
            if($scope.userInfo.identifier){
                $location.path('/user/' + $scope.userInfo.identifier + '/details');
            }
        };

        vm.callCompanyInfoFunctionIfNotInTheseRoutes = function (currentLocation) {
            if(currentLocation.indexOf('login') < 0 && currentLocation.indexOf('verification') < 0 &&
                currentLocation.indexOf('company/name_request') < 0 && currentLocation.indexOf('register') < 0 &&
                currentLocation.indexOf('password/reset') < 0 && currentLocation.indexOf('authentication/multi-factor/verify/sms') < 0 &&
                currentLocation.indexOf('authentication/multi-factor/verify/token') < 0 && currentLocation.indexOf('/currency/add/initial') < 0
                && currentLocation.indexOf('company/setup/') < 0 && currentLocation.indexOf('welcome_to_rehive') < 0
            ){
                vm.getCompanyInfo();
            }
        };
        vm.callCompanyInfoFunctionIfNotInTheseRoutes(vm.currentLocation);


        vm.getCompanyCurrencies = function(){
            if(vm.token){
                $http.get(environmentConfig.API + '/admin/currencies/?enabled=true', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $window.sessionStorage.currenciesList = JSON.stringify(res.data.data.results);
                    }
                }).catch(function (error) {
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

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
                            vm.findTransactions(searchString,'id')
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
                $state.go('users',{mobile: $scope.searchString})
            } else {
                $state.go('users',{email: $scope.searchString})
            }

        };

        $scope.goToTransactionsHistory = function (transaction) {
            $scope.hidingSearchBar();
            if(transaction && transaction.id){
                $state.go('transactions.history',{transactionId: transaction.id})
            } else if($scope.searchedUsers.length > 0) {
                $state.go('transactions.history',{identifier: $scope.searchedUsers[0].identifier});
            } else {
                $state.go('transactions.history');
            }
        };

        $scope.logout = function(){
            $rootScope.gotToken = false;
            $rootScope.securityConfigured = true;
            $rootScope.companyName = null;
            $rootScope.userFullyVerified = false;
            cookieManagement.deleteCookie('TOKEN');
            $location.path('/login');
        };
    }

})();
