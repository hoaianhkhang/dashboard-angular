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
    'ui.codemirror',
    'ng.codemirror.dictionary.hint',
    'BlurAdmin.theme',
    'BlurAdmin.pages'
])
    .config(function (ngIntlTelInputProvider) {
    ngIntlTelInputProvider.set({initialCountry: 'us',utilsScript: 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/12.0.1/js/utils.js'});
})
    .run(function($rootScope,errorHandler,localStorageManagement,toastr,Rehive,
                  environmentConfig,$window,$location,_){

        $window.onload = function(){
            $rootScope.$pageFinishedLoading = true;
        };

        if(!localStorageManagement.getValue('DATE_FORMAT')){
            localStorageManagement.setValue('DATE_FORMAT','MM/dd/yyyy');
        }

        $rootScope.dashboardTitle = 'Rehive';

        $rootScope.pageTopObj = {};

        //using to check if user is in changing password or setting up 2 factor authentication
        $rootScope.securityConfigured = true;

        var locationChangeStart = $rootScope.$on('$locationChangeStart', function (event,newUrl,oldUrl) {

            $rootScope.shouldBeBlue = '';

            var newUrlArray = newUrl.split('/'),
                newUrlLastElement = _.last(newUrlArray);

            routeManagement(event,newUrl,oldUrl);
        });

        function routeManagement(event,newUrl,oldUrl){
            var token = localStorageManagement.getValue('token'),
                newUrlArray = newUrl.split('/'),
                newUrlLastElement = _.last(newUrlArray);

            if(!$rootScope.pageTopObj.companyObj){
                var getCompanyInfo = function () {
                    if(token) {
                        Rehive.admin.company.get().then(function (res) {
                            $rootScope.pageTopObj.companyObj = {};
                            $rootScope.pageTopObj.companyObj = res;
                            localStorageManagement.setValue('companyIdentifier',$rootScope.pageTopObj.companyObj.id);
                            $rootScope.$apply();
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
                            $rootScope.$apply();
                        });
                    }
                };
                getCompanyInfo();
            }

            if(!$rootScope.pageTopObj.userInfoObj){
                var getUserInfo = function () {
                    if(token) {
                        Rehive.user.get().then(function(user){
                            $rootScope.pageTopObj.userInfoObj = {};
                            $rootScope.pageTopObj.userInfoObj = user;
                            $rootScope.$apply();
                        },function(error){
                            if(error.status == 401){
                                $rootScope.gotToken = false;
                                $rootScope.securityConfigured = true;
                                $rootScope.pageTopObj = {};
                                localStorageManagement.deleteValue('TOKEN');
                                localStorageManagement.deleteValue('token');
                                Rehive.removeToken();
                                $location.path('/login');
                            }
                            $rootScope.$apply();
                        });
                    }
                };
                getUserInfo();
            }

            if(newUrlLastElement == 'login'){
                localStorageManagement.deleteValue('TOKEN');
                localStorageManagement.deleteValue('token');
                Rehive.removeToken();
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
