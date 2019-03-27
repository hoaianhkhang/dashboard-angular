(function () {
    'use strict';

    angular.module('BlurAdmin.pages.getStarted')
        .controller('GetStartedCtrl', GetStartedCtrl);

    /** @ngInject */
    function GetStartedCtrl($rootScope,$scope,$location,localStorageManagement,
                            $window, errorHandler,$state,serializeFiltersService,$uibModal,Rehive,$intercom) {

        $intercom.update({});
        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        $rootScope.dashboardTitle = 'Get started | Rehive';
        $scope.inWalletOptions = false;
        $scope.adminEmail = "";
        $scope.adminCompany = "";

        vm.getCompanyAdmin = function(){
            Rehive.user.get().then(function(res){
                console.log(res);
                $scope.adminEmail = res.email;
                $scope.adminCompany = res.company;
                $scope.$apply();
            },function(err){
                $scope.$apply();
            });
        };
        vm.getCompanyAdmin();

        $scope.goToWalletOptions = function(){
            $scope.inWalletOptions = true;
            $intercom.trackEvent('try-wallet', {page: "get_started"});
        };

        $scope.goBackToGetStarted = function(){
            $scope.inWalletOptions = false;
        };

        $scope.openIntercomm = function(){
            $intercom.show();
            $intercom.trackEvent('chat', {page: "get_started"});
        };

        $scope.openRehiveContactForm = function(){
            $intercom.trackEvent('contact', {page: "get_started"});
            $window.open('https://rehive.typeform.com/to/hBcRmF', '_blank');
        };

        $scope.openWebWallet = function(){
            $intercom.trackEvent('open-wallet', {page: "try_wallet"});
            $window.open('https://wallet.rehive.com/register?company=' + $scope.adminCompany, '_blank');
        };

        $scope.openBusinessCases = function(){
            $window.open('https://docsend.com/view/yx2vhzm', '_blank');
            $intercom.trackEvent('learn-more', {page: "get_started"});
        };

        $scope.walletLearnMore = function(){
            $intercom.trackEvent('learn-more', {page: "try_wallet"});
            $window.open('https://docsend.com/view/yx2vhzm', '_blank');
        };

        $scope.openWalletContact = function(){
            $intercom.trackEvent('contact', {page: "try_wallet"});
            $window.open('https://rehive.typeform.com/to/hBcRmF', '_blank');
        };
    }
})();
