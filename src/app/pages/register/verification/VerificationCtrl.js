(function () {
    'use strict';

    angular.module('BlurAdmin.pages.verification')
        .controller('VerificationCtrl', VerificationCtrl);

    /** @ngInject */
    function VerificationCtrl($rootScope,Rehive,$scope,toastr,localStorageManagement,environmentConfig,serializeFiltersService,
                              $location,errorHandler,userVerification,$intercom,$window,Upload, demoSetupService) {

        $intercom.update({});
        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        $scope.companyName = "";
        // $scope.user = {};
        // $scope.verifyingEmail = false;
        $rootScope.dashboardTitle = 'Welcome | Rehive';
        $rootScope.$pageFinishedLoading = true;
        $rootScope.inVerification = true;
        $rootScope.tasksCompleted = 0;
        $scope.show = false;
        // $rootScope.tasksCompleted = 35;
        $rootScope.settingUpDemo = true;
        $scope.template1 = false;
        $scope.template2 = false;
        $scope.template3 = true;
        $scope.companyName = "";
        $scope.imageFile = {
            file: {},
            iconFile: {}
        };

        vm.testProgress = function(){
            var interval = setInterval(function(){
                $rootScope.tasksCompleted++;
                $scope.percent = Math.round(($rootScope.tasksCompleted / 39) * 100);
                if($rootScope.tasksCompleted > 39){
                    clearInterval(interval);
                    return false;
                }
                $scope.$apply();
            },500);
        };
        vm.testProgress();

        $scope.upload = function () {
            if(!$scope.imageFile.file.name && !$scope.imageFile.iconFile.name){
                return;
            }
            $scope.updatingLogo = true;

            var uploadDataObj = {
                logo: $scope.imageFile.file.name ? $scope.imageFile.file: null,
                icon: $scope.imageFile.iconFile.name ? $scope.imageFile.iconFile: null
            };

            Upload.upload({
                url: environmentConfig.API +'/admin/company/',
                data: serializeFiltersService.objectFilters(uploadDataObj),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token},
                method: "PATCH"
            }).then(function (res) {
                if (res.status === 200) {
                    setTimeout(function(){
                        $scope.companyImageUrl = res.data.data.logo;
                    },0);
                }
            }).catch(function (error) {
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };
        $scope.openOverview = function(){
            $window.open('https://docsend.com/view/yx2vhzm', '_blank');
        };

        $scope.askForCompanyName = function(){
          $scope.template1 = false;
          $scope.template2 = true;
        };

        $scope.backToLanding = function(){
            $scope.template1 = true;
            $scope.template2 = false;
        };

        $scope.launchDemoSetup = function(){
            $scope.template1 = false;
            $scope.template2 = false;
            $scope.template3 = true;
            $rootScope.settingUpDemo = true;
            demoSetupService.initializeDemoSetup($scope.companyName);
        };
    /**
        vm.checkIfUserVerified = function(){
            userVerification.verify(function(err,verified){
                if(verified){
                    $location.path('/company/setup/initial');
                } else {
                    vm.getUserInfo();
                }
            });
        };
        vm.checkIfUserVerified();

        $scope.verifyUser = function(){
            $location.path('/company/setup/initial');
        };

        vm.getUserInfo = function(){
            Rehive.user.get().then(function(res){
                $scope.user = res;
                $rootScope.$pageFinishedLoading = true;
                $rootScope.$apply();
            },function(error){
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $rootScope.$apply();
            });
        };

        $scope.resendEmail = function(){
            Rehive.auth.email.resendEmailVerification({
                email: $scope.user.email,
                company: $scope.user.company
            }).then(function(res){
                toastr.success('Verification email has been re-sent');
                $scope.$apply();
            },function(error){
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

        $scope.logout = function () {
            $rootScope.dashboardTitle = 'Rehive';
            $rootScope.gotToken = false;
            $rootScope.securityConfigured = true;
            $rootScope.pageTopObj = {};
            $intercom.shutdown();
            localStorageManagement.deleteValue('TOKEN');
            localStorageManagement.deleteValue('token');
            Rehive.removeToken();
            $location.path('/login');
        };
    **/

    }
})();
