(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.currencyConversionService.currencyConversionQuotes')
        .controller('CurrencyConversionQuotesModalCtrl', CurrencyConversionQuotesModalCtrl);

    function CurrencyConversionQuotesModalCtrl($scope,metadataTextService,quote,localStorageManagement,$uibModal,$http,
                                               $uibModalInstance,toastr,errorHandler,$ngConfirm,$window) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.baseUrl = localStorageManagement.getValue('SERVICEURL');
        $scope.quote = quote;
        $scope.formatted = {};
        $scope.formatted.metadata = metadataTextService.convertToText(quote.metadata);
        $scope.updateQuoteObj = {};
        $scope.editingQuote = false;
        $scope.deletingQuote = false;

        $scope.goToUserView =  function (uuid) {
            var url = '/#/user/' + uuid + '/details';
            $window.open(url,'_blank');
        };

        $scope.editQuote = function(){
            var metaData;
            if($scope.updateQuoteObj.metadata){
                if(vm.isJson($scope.updateQuoteObj.metadata)){
                    metaData =  JSON.parse($scope.updateQuoteObj.metadata);
                } else {
                    toastr.error('Incorrect metadata format');
                    return false;
                }
            } else {
                metaData = {};
            }

            $scope.deletingQuote = true;
            if(vm.token) {
                $http.patch(vm.baseUrl + 'admin/quotes/' + $scope.quote.id + '/',
                    {
                        metadata: metaData
                    }, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': vm.token
                        }
                    }).then(function (res) {
                    if (res.status === 200) {
                        if(metaData == {}){
                            delete $scope.formatted.metadata;
                            delete $scope.quote.metadata;
                        } else {
                            $scope.quote.metadata = metaData;
                            $scope.formatted.metadata = metadataTextService.convertToText(metaData);
                        }

                        $scope.toggleEditingQuote();
                        toastr.success('Quote successfully updated');
                        $scope.deletingQuote = false;
                    }
                }).catch(function (error) {
                    $scope.deletingQuote = false;
                    $uibModalInstance.close();
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.isJson = function (str) {
            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }
            return true;
        };

        $scope.toggleEditingQuote = function () {
            if(!$scope.editingQuote){
                if($scope.formatted.metadata){
                    $scope.updateQuoteObj.metadata = JSON.stringify($scope.quote.metadata);
                } else {
                    $scope.updateQuoteObj.metadata = '';
                }
            } else {
                delete $scope.updateQuoteObj.metadata;
            }

            $scope.editingQuote = !$scope.editingQuote;
        };

        $scope.goToConvertQuoteView = function (page, size) {
            vm.theSecondModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'ConvertCurrencyConversionQuoteModalCtrl',
                scope: $scope,
                resolve: {
                    quote: function () {
                        return quote;
                    }
                }
            });
        };

        $scope.deleteQuoteConfirm = function () {
            $ngConfirm({
                title: 'Delete quote',
                content: 'Are you sure you want to delete this quote?',
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
                            $scope.deleteQuote();
                        }
                    }
                }
            });
        };

        $scope.deleteQuote = function () {
            $scope.deletingQuote = true;
            $http.delete(vm.baseUrl + 'admin/quotes/' + quote.id + '/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.deletingQuote = false;
                if (res.status === 200) {
                    toastr.success('Quote deleted successfully');
                    $uibModalInstance.close(res.data);
                }
            }).catch(function (error) {
                $scope.deletingQuote = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

    }
})();
