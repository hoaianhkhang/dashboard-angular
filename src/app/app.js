'use strict';

angular.module('BlurAdmin', [
    'BlurAdmin.config',
    'cp.ngConfirm',
    'ngFileUpload',
    'ngSanitize',
    'ngCookies',
    'ui.bootstrap',
    'ui.router',
    'toastr',
    'countrySelect',
    'angular-click-outside',
    'ngCsv',
    'iso-3166-country-codes',
    'ngclipboard',
    'ngIntlTelInput',
    'localytics.directives',
    'ngTagsInput',
    'BlurAdmin.theme',
    'BlurAdmin.pages'
])
    .config(function (ngIntlTelInputProvider) {
    ngIntlTelInputProvider.set({initialCountry: 'us',utilsScript: 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/12.0.1/js/utils.js'});
})
    .run(function($rootScope,errorHandler,localStorageManagement,toastr,
                  userVerification,$http,environmentConfig,$window,$location,_){

        $window.onload = function(){
            $rootScope.$pageFinishedLoading = true;
        };

        $rootScope.dashboardTitle = 'Rehive';

        $rootScope.pageTopObj = {};

        //using to check if user is in changing password or setting up 2 factor authentication
        $rootScope.securityConfigured = true;

        var locationChangeStart = $rootScope.$on('$locationChangeStart', function (event,newUrl) {

            $rootScope.shouldBeBlue = '';

            var newUrlArray = newUrl.split('/'),
                newUrlLastElement = _.last(newUrlArray);

            routeManagement(event,newUrl);
        });

        function routeManagement(event,newUrl){
            var token = localStorageManagement.getValue('TOKEN'),
                newUrlArray = newUrl.split('/'),
                newUrlLastElement = _.last(newUrlArray);

            if(!$rootScope.pageTopObj.companyObj){
                var getCompanyInfo = function () {
                    if(token) {
                        $http.get(environmentConfig.API + '/admin/company/', {
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': token
                            }
                        }).then(function (res) {
                            if (res.status === 200) {
                                $rootScope.pageTopObj.companyObj = {};
                                $rootScope.pageTopObj.companyObj = res.data.data;
                                localStorageManagement.setValue('companyIdentifier',$rootScope.pageTopObj.companyObj.identifier);
                            }
                        }).catch(function (error) {
                            if(error.status == 401){
                                $rootScope.gotToken = false;
                                $rootScope.securityConfigured = true;
                                $rootScope.pageTopObj = {};
                                localStorageManagement.deleteValue('TOKEN');
                                $location.path('/login');
                            }
                        });
                    }
                };
                getCompanyInfo();
            }

            if(!$rootScope.pageTopObj.userInfoObj){
                var getUserInfo = function () {
                    if(token) {
                        $http.get(environmentConfig.API + '/user/', {
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': token
                            }
                        }).then(function (res) {
                            if (res.status === 200) {
                                $rootScope.pageTopObj.userInfoObj = {};
                                $rootScope.pageTopObj.userInfoObj = res.data.data;
                            }
                        }).catch(function (error) {
                            if(error.status == 401){
                                $rootScope.gotToken = false;
                                $rootScope.securityConfigured = true;
                                $rootScope.pageTopObj = {};
                                localStorageManagement.deleteValue('TOKEN');
                                $location.path('/login');
                            }
                        });
                    }
                };
                getUserInfo();
            }

            if(newUrlLastElement == 'login'){
                localStorageManagement.deleteValue('TOKEN');
                $rootScope.dashboardTitle = 'Rehive';
                $rootScope.gotToken = false;
                $rootScope.securityConfigured = true;
                $rootScope.pageTopObj = {};
                $window.sessionStorage.currenciesList = '';
                $location.path('/login');
            } else{
                if(newUrl.indexOf('password/reset/confirm') > 0 || newUrl.indexOf('email/verify') > 0) {
                    $rootScope.securityConfigured = false;
                } else if(newUrlLastElement == 'register' || newUrlLastElement == 'reset'
                    || newUrlLastElement == 'verification' || newUrlLastElement == 'info_request' || newUrlLastElement == 'welcome_to_rehive'
                    || newUrl.indexOf('company/setup/') > 0){
                    $rootScope.securityConfigured = false;
                } else if(token){

                    //redirect users from transaction/credit or transactions/debit  to transactions/history
                    if(newUrl.indexOf('transactions/credit') > 0 || newUrl.indexOf('transactions/debit') > 0 ||
                        newUrl.indexOf('transactions/transfer') > 0){
                        $location.path('/transactions/history');
                    }

                    localStorageManagement.deleteValue('setupUsers');
                    localStorageManagement.deleteValue('setupCurrencies');
                    localStorageManagement.deleteValue('setupAccounts');
                    localStorageManagement.deleteValue('setupSubtypes');
                    localStorageManagement.deleteValue('activeSetupRoute');
                    $rootScope.gotToken = true;
                    $rootScope.securityConfigured = true;
                } else {
                    $rootScope.dashboardTitle = 'Rehive';
                    $rootScope.gotToken = false;
                    $rootScope.securityConfigured = true;
                    $rootScope.pageTopObj = {};
                    $location.path('/login');
                    $location.replace();
                }

            }

            //checking if changing password or setting up multi factor authentication
            if(newUrlLastElement == 'change' || newUrlLastElement == 'multi-factor'
            || newUrl.indexOf('/multi-factor/sms') > 0 || newUrl.indexOf('/multi-factor/verify') > 0){
                $rootScope.securityConfigured = false;
            }
        };
    });
