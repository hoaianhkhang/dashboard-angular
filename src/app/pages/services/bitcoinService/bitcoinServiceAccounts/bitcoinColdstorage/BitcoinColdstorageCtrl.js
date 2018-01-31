(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.bitcoinService.bitcoinServiceAccounts')
        .controller('BitcoinColdstorageCtrl', BitcoinColdstorageCtrl);

    /** @ngInject */
    function BitcoinColdstorageCtrl($scope,cookieManagement,errorHandler,currenciesList,$http) {
        $scope.bitcoinAccountSettingView = '';

        var vm = this;
        vm.serviceUrl = cookieManagement.getCookie('SERVICEURL');
        vm.token = cookieManagement.getCookie('TOKEN');
        $scope.bitcoinCurrency = currenciesList.find(function (element) {
            return element.code == 'XBT';
        });
        $scope.showOptionsAccountRef = false;
        $scope.loadingColdstorage = true;

        $scope.closeOptionsBox = function () {
            $scope.showOptionsAccountRef = false;
        };

        $scope.toggleCurrenciesOptions = function () {
            $scope.showOptionsAccountRef = !$scope.showOptionsAccountRef;
        };

        vm.getColdstorage = function () {
            $scope.loadingColdstorage =  true;
            if(vm.token) {
                $http.get(vm.serviceUrl + 'admin/coldstorage/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingColdstorage =  false;
                    if (res.status === 200) {
                        $scope.coldstorageObj = res.data.data;
                    }
                }).catch(function (error) {
                    $scope.loadingColdstorage =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        vm.getColdstorage();


    }

})();
