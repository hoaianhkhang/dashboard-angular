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
            $state.go('transactions.credit',{"email": email});
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
                            $rootScope.pageTopObj.companyObj = res.data.data;
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
                $http.get(environmentConfig.API + '/admin/currencies/?enabled=true', {
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
                $state.go('users',{mobile: $scope.searchString});
            } else {
                $state.go('users',{email: $scope.searchString});
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
            $rootScope.pageTopObj = {};
            $rootScope.userFullyVerified = false;
            cookieManagement.deleteCookie('TOKEN');
            $location.path('/login');
        };
    }

})();
