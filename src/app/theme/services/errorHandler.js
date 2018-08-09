(function () {
    'use strict';

    angular.module('BlurAdmin.theme')
        .factory('errorHandler', errorHandler);

    /** @ngInject */
    function errorHandler(toastr,$location,localStorageManagement,$rootScope) {

        return {
            evaluateErrors: function (errors) {
              if(errors && errors.data){
                for(var key in errors.data){
                    if (errors.data.hasOwnProperty(key)) {
                        if(Array.isArray(errors.data[key])){
                            errors.data[key].forEach(function(error){
                                if(key == 'non_field_errors'){
                                    key = 'error';
                                }
                                toastr.error(error, (key.charAt(0).toUpperCase() + key.slice(1)));
                            });
                        } else {
                            toastr.error(errors.message);
                        }
                    }
                }
              } else{
                  if(errors && errors.message){
                      if(errors.message == 'Invalid token.'){
                          toastr.error('Your session has expired, please log in again');
                      } else {
                          toastr.error(errors.message);
                      }
                  } else {
                      toastr.error('Something went wrong, please check your internet connection or try again');
                  }
              }
            },
            handleErrors: function(errors){
                if(errors && errors.status){
                    if(errors.status == 401){
                        $rootScope.gotToken = false;
                        $rootScope.securityConfigured = true;
                        $rootScope.pageTopObj = {};
                        localStorageManagement.deleteValue('TOKEN');
                        $location.path('/login');
                    }
                }
            }
        };
    }

})();
