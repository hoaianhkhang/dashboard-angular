(function () {
    'use strict';

    angular.module('BlurAdmin.pages.newCompanySetup.setupTransactionSubtypes')
        .controller("SetupTransactionSubtypesCtrl", SetupTransactionSubtypesCtrl);

    function SetupTransactionSubtypesCtrl($rootScope,$scope,$http,cookieManagement,toastr,$ngConfirm,$filter,
                                            environmentConfig,$location,errorHandler,localStorageManagement) {

        var vm = this;
        vm.token=cookieManagement.getCookie("TOKEN");
        $scope.subtypes = [];
        $scope.subtype={};
        $rootScope.$pageFinishedLoading=true;
        $rootScope.activeSetupRoute = 3;
        localStorageManagement.setValue('activeSetupRoute',3);
        $scope.editingSubtypes = false;
        $scope.loadingSetupSubtypes= true;

        $scope.goToNextView=function () {
            $location.path('/currencies');
        };
        $scope.goToPrevView=function () {
            $location.path('company/setup/accounts');
        };

        $scope.setupSubtypesNameChanged = function (subtype) {
            if(subtype.name){
                subtype.name = subtype.name.toLowerCase();
                subtype.label = $filter('capitalizeWord')(subtype.name).replace(/_/g, " ").replace(/-/g, " ");
            } else {
                subtype.label = '';
            }
        };

        vm.getSubtypes = function(){
            if(vm.token){
                $scope.loadingSetupSubtypes= true;
                $http.get(environmentConfig.API + '/admin/subtypes/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $scope.subtypes = res.data.data;
                        if($scope.subtypes.length==0){
                            $rootScope.setupSubtypes = 0;
                            localStorageManagement.setValue('setupSubtypes',0);
                        }
                        else {
                            $rootScope.setupSubtypes = 1;
                            localStorageManagement.setValue('setupSubtypes',1);
                        }
                        $scope.loadingSetupSubtypes= false;
                    }
                }).catch(function (error) {
                    $scope.loadingSetupSubtypes= false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            } else {
                $rootScope.gotToken = false;
                $rootScope.securityConfigured = true;
                $rootScope.pageTopObj = {};
                $rootScope.userFullyVerified = false;
                cookieManagement.deleteCookie('TOKEN');
                toastr.error('Your session has expired, please log in again');
                $location.path('/login');
            }
        };
        vm.getSubtypes();
        
        $scope.addSubtype = function (subtype) {
            $scope.loadingSetupSubtypes= true;
            $http.post(environmentConfig.API + '/admin/subtypes/',subtype, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                if (res.status === 201) {
                    $scope.subtype={};
                    vm.getSubtypes();
                }
            }).catch(function (error) {
                $scope.loadingSetupSubtypes= false;
                $rootScope.$pageFinishedLoading = true;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        $scope.updateSubtype = function (subtype) {
            $scope.loadingSetupSubtypes= true;
            var newSubtype = {
                tx_type: subtype.tx_type,
                label: subtype.label
            };
            if(subtype.prevName!==subtype.name){
                newSubtype.name = subtype.name;
            }
            $http.patch(environmentConfig.API + '/admin/subtypes/' + subtype.id + '/', newSubtype, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                if (res.status === 200) {
                    $scope.subtype={};
                    $scope.editingSubtypes = false;
                    $scope.loadingSetupSubtypes= false;
                }
            }).catch(function (error) {
                $scope.loadingSetupSubtypes= false;
                $rootScope.$pageFinishedLoading = true;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        $scope.deleteSubtypeConfirm = function (id) {
            $ngConfirm({
                title: 'Delete subtype',
                content: 'Are you sure you want to delete this subtype?',
                animationBounce: 1,
                animationSpeed: 100,
                scope: $scope,
                buttons: {
                    close: {
                        text: "No",
                        btnClass: 'btn-default pull-left dashboard-btn'
                    },
                    ok: {
                        text: "Yes",
                        btnClass: 'btn-primary dashboard-btn',
                        keys: ['enter'], // will trigger when enter is pressed
                        action: function(scope){
                            $scope.deleteSelectedItem(id);
                        }
                    }
                }
            });
        };

        $scope.deleteSelectedItem = function (id) {
            $scope.loadingSetupSubtypes= true;
            $http.delete(environmentConfig.API + '/admin/subtypes/' + id + '/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                if (res.status === 200) {
                    vm.getSubtypes();
                }
            }).catch(function (error) {
                $scope.loadingSetupSubtypes= false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        $scope.editSubtypeObj = function(subtype) {
            $scope.subtype = subtype;
            $scope.editingSubtypes = true;
            $scope.subtype.prevName = subtype.name;
        };
    }
})();
