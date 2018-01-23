(function () {
    'use strict';

    angular.module('BlurAdmin.pages.companyInfoRequest')
        .controller('CompanyInfoRequestCtrl', CompanyInfoRequestCtrl);

    /** @ngInject */
    function CompanyInfoRequestCtrl($rootScope,$scope,$http,toastr,cookieManagement,environmentConfig,$location,errorHandler,userVerification) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
        $rootScope.$pageFinishedLoading = false;
        $scope.company = {
            name: ''
        };

        $scope.goToNextView = function(){
            $rootScope.userFullyVerified = true;
            $location.path('company/setup/initial');
        };

        vm.getCompanyInfo = function () {
            if(vm.token) {
                $http.get(environmentConfig.API + '/admin/company/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        if(res.data.data && res.data.data.name){
                            $rootScope.pageTopObj.companyObj = res.data.data;
                            userVerification.verify(function(err,verified){
                                if(verified){
                                    $rootScope.userFullyVerified = true;
                                    $location.path('company/setup/initial');
                                } else {
                                    $location.path('/verification');
                                    toastr.error('Please verify your account','Message');
                                    $rootScope.$pageFinishedLoading = true;
                                }
                            });
                        } else {
                            $rootScope.$pageFinishedLoading = true;
                        }
                    }
                }).catch(function (error) {
                    $rootScope.$pageFinishedLoading = true;
                    errorHandler.evaluateErrors(error.data);
                    if(error.status == 403){
                        $location.path('/login');
                    }
                    errorHandler.handleErrors(error);
                });
            }
        };
        vm.getCompanyInfo();

        $scope.updateCompanyInfo = function (company) {
            $rootScope.$pageFinishedLoading = false;
            $http.patch(environmentConfig.API + '/admin/company/',company, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                if (res.status === 200) {
                    $rootScope.pageTopObj.companyObj = res.data.data;
                    userVerification.verify(function(err,verified){
                        if(verified){
                            $rootScope.userFullyVerified = true;
                            toastr.success('You have successfully updated the company info');
                            $location.path('company/setup/initial');
                        } else {
                            $location.path('/verification');
                            toastr.error('Please verify your account','Message');
                            $rootScope.$pageFinishedLoading = true;
                        }
                    });
                }
            }).catch(function (error) {
                $rootScope.$pageFinishedLoading = true;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

    }
})();
