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
    'BlurAdmin.theme',
    'BlurAdmin.pages'
])
    .config(function (ngIntlTelInputProvider) {
    ngIntlTelInputProvider.set({initialCountry: 'us',utilsScript: 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/12.0.1/js/utils.js'});
})
    .run(function($rootScope,cookieManagement,errorHandler,
                  userVerification,$http,environmentConfig,$window,$location,_){

        $window.onload = function(){
            $rootScope.$pageFinishedLoading = true;
        };

        //using to check if user is in changing password or setting up 2 factor authentication
        $rootScope.securityConfigured = true;

        //using to check if user is in changing password or setting up 2 factor authentication
        $rootScope.userFullyVerified = false;

        var locationChangeStart = $rootScope.$on('$locationChangeStart', function (event,newUrl) {

            var newUrlArray = newUrl.split('/'),
                newUrlLastElement = _.last(newUrlArray);

            if(!$rootScope.userFullyVerified){
                //using to check if user has a verified email address
                var verifyUser = function (){
                    userVerification.verify(function(err,verified){
                        if(verified){
                            $rootScope.userVerified = true;
                            getCompanyInfo();
                        } else {
                            $rootScope.userVerified = false;
                            $location.path('/verification');
                        }
                    });
                };
                if(newUrlLastElement != 'change' && newUrlLastElement != 'multi-factor'
                    && newUrl.indexOf('/multi-factor/sms') < 0 && newUrl.indexOf('/multi-factor/verify') < 0
                    && newUrl.indexOf('password/reset/confirm') < 0 && newUrl.indexOf('email/verify') < 0
                    && newUrl.indexOf('register') < 0 && newUrl.indexOf('password/reset') < 0){
                    verifyUser();
                }

                //using to check if user has a company name
                var getCompanyInfo = function () {
                    var token = cookieManagement.getCookie('TOKEN');
                    if(token && $rootScope.userVerified) {
                        $http.get(environmentConfig.API + '/admin/company/', {
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': token
                            }
                        }).then(function (res) {
                            if (res.status === 200) {
                                if(newUrl.indexOf('/company/name_request')<0 && newUrl.indexOf('/welcome_rehive')<0 && newUrl.indexOf('/company/setup')){
                                    $rootScope.haveCompanyName = true;
                                    $rootScope.companyName = res.data.data.name;
                                    getCompanyCurrencies(token);
                                }
                            }
                        }).catch(function (error) {
                            $rootScope.haveCompanyName = false;
                            errorHandler.handleErrors(error);
                        });
                    } else {
                        $location.path('/login');
                    }
                };

            //using to check if user has at least one currency
            var getCompanyCurrencies = function(token){
                if(token){
                    $http.get(environmentConfig.API + '/admin/currencies/?enabled=true', {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': token
                        }
                    }).then(function (res) {
                            if (res.status === 200) {
                                if(res.data.data.results.length == 0){
                                    $location.path('currency/add/initial');
                                } else {
                                    $rootScope.intialCurrency = true;
                                    if($rootScope.intialCurrency && $rootScope.haveCompanyName && $rootScope.userVerified) {
                                        $rootScope.userFullyVerified = true;
                                    } else {
                                        $rootScope.userFullyVerified = false;
                                    }

                                    $window.sessionStorage.currenciesList = JSON.stringify(res.data.data.results);
                                }
                            }
                        }).catch(function (error) {
                            errorHandler.evaluateErrors(error.data);
                            errorHandler.handleErrors(error);
                        });
                    }
                };

            }

            routeManagement(event,newUrl);
        });

        function routeManagement(event,newUrl){
            var token = cookieManagement.getCookie('TOKEN'),
                newUrlArray = newUrl.split('/'),
                newUrlLastElement = _.last(newUrlArray);

            if(newUrlLastElement == 'login'){
                cookieManagement.deleteCookie('TOKEN');
                $rootScope.gotToken = false;
                $rootScope.securityConfigured = true;
                $rootScope.userFullyVerified = false;
                $location.path('/login');
            } else{
                if(newUrl.indexOf('password/reset/confirm') > 0 || newUrl.indexOf('email/verify') > 0) {
                    $rootScope.securityConfigured = false;
                }
                else if(newUrl.indexOf('company/setup/') > 0) {
                    $rootScope.gotToken = false;
                    $rootScope.securityConfigured = true;
                } else if(newUrlLastElement == 'register' || newUrlLastElement == 'reset'
                    || newUrlLastElement == 'verification' || newUrlLastElement == 'name_request' || newUrlLastElement == 'welcome_rehive'){
                    $rootScope.securityConfigured = false;
                } else if(token){
                    $rootScope.gotToken = true;
                    $rootScope.securityConfigured = true;
                } else {
                    $rootScope.securityConfigured = true;
                    $rootScope.gotToken = false;
                    $location.path('/login');
                }

            }

            //checking if changing password or setting up multi factor authentication
            if(newUrlLastElement == 'change' || newUrlLastElement == 'multi-factor'
            || newUrl.indexOf('/multi-factor/sms') > 0 || newUrl.indexOf('/multi-factor/verify') > 0){
                $rootScope.securityConfigured = false;
            }
        };
    });
