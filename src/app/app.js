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
    .run(function($rootScope,cookieManagement,errorHandler,localStorageManagement,toastr,
                  userVerification,$http,environmentConfig,$window,$location,_){

        $window.onload = function(){
            $rootScope.$pageFinishedLoading = true;
        };

        $rootScope.dashboardTitle = 'Rehive';

        $rootScope.pageTopObj = {};

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
                            $rootScope.userFullyVerified = true;
                        } else {
                            $rootScope.userFullyVerified = false;
                            $location.path('/verification');
                        }
                    });
                };
                if(newUrlLastElement != 'change' && newUrlLastElement != 'multi-factor'
                    && newUrl.indexOf('/multi-factor/sms') < 0 && newUrl.indexOf('/multi-factor/verify') < 0
                    && newUrl.indexOf('password/reset/confirm') < 0 && newUrl.indexOf('email/verify') < 0
                    && newUrl.indexOf('register') < 0 && newUrl.indexOf('password/reset') < 0 && newUrl.indexOf('company/setup/') < 0){
                    verifyUser();
                }

            }

            routeManagement(event,newUrl);
        });

        function routeManagement(event,newUrl){
            var token = cookieManagement.getCookie('TOKEN'),
                newUrlArray = newUrl.split('/'),
                newUrlLastElement = _.last(newUrlArray);

            if($rootScope.userFullyVerified && !$rootScope.pageTopObj.companyObj){
                var getCompanyInfo = function () {
                    if(token) {
                        $http.get(environmentConfig.API + '/admin/company/', {
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': token
                            }
                        }).then(function (res) {
                            if (res.status === 200) {
                                $rootScope.pageTopObj.companyObj = res.data.data;
                            }
                        }).catch(function (error) {
                            errorHandler.evaluateErrors(error.data);
                            errorHandler.handleErrors(error);
                        });
                    }
                };
                getCompanyInfo();
            }

            if($rootScope.userFullyVerified && !$rootScope.pageTopObj.userInfoObj){
                var getUserInfo = function () {
                    if(token) {
                        $http.get(environmentConfig.API + '/user/', {
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': token
                            }
                        }).then(function (res) {
                            if (res.status === 200) {
                                $rootScope.pageTopObj.userInfoObj = res.data.data;
                            }
                        }).catch(function (error) {
                            errorHandler.evaluateErrors(error.data);
                            errorHandler.handleErrors(error);
                        });
                    }
                };
                getUserInfo();
            }

            if(newUrlLastElement == 'login'){
                cookieManagement.deleteCookie('TOKEN');
                $rootScope.dashboardTitle = 'Rehive';
                $rootScope.gotToken = false;
                $rootScope.securityConfigured = true;
                $rootScope.pageTopObj = {};
                $rootScope.userFullyVerified = false;
                $location.path('/login');
            } else{
                if(newUrl.indexOf('password/reset/confirm') > 0 || newUrl.indexOf('email/verify') > 0) {
                    $rootScope.securityConfigured = false;
                } else if(newUrlLastElement == 'register' || newUrlLastElement == 'reset'
                    || newUrlLastElement == 'verification' || newUrlLastElement == 'info_request' || newUrlLastElement == 'welcome_to_rehive'
                    || newUrl.indexOf('company/setup/') > 0){
                    $rootScope.securityConfigured = false;
                } else if(token){
                    localStorageManagement.deleteValue('setupUsers');
                    localStorageManagement.deleteValue('setupCurrencies');
                    localStorageManagement.deleteValue('setupAccounts');
                    localStorageManagement.deleteValue('setupSubtypes');
                    localStorageManagement.deleteValue('activeSetupRoute');
                    $rootScope.gotToken = true;
                    $rootScope.securityConfigured = true;
                } else {
                    toastr.error('Your session has expired, please log in again', 'Message');
                    $rootScope.dashboardTitle = 'Rehive';
                    $rootScope.gotToken = false;
                    $rootScope.securityConfigured = true;
                    $rootScope.pageTopObj = {};
                    $rootScope.userFullyVerified = false;
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
