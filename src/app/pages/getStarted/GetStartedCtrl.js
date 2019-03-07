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
        };

        $scope.goBackToGetStarted = function(){
            $scope.inWalletOptions = false;
        };

        $scope.openIntercomm = function(){
            $intercom.show();
        };

        $scope.openRehiveContactForm = function(){
            $window.open('https://rehive.typeform.com/to/hBcRmF', '_blank');
        };

        $scope.openWebWallet = function(){
            $window.open('https://wallet.rehive.com/register?company=' + $scope.adminCompany, '_blank');
        };

    }
})();
