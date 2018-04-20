(function () {
    'use strict';

    angular.module('BlurAdmin.theme')
        .factory('userVerification', userVerification);

    /** @ngInject */
    function userVerification($http,localStorageManagement,environmentConfig,errorHandler) {

        return {
            verify: function (cb) {
                var token = localStorageManagement.getValue('TOKEN');
                var emailVerified = false;

                if(token) {
                    $http.get(environmentConfig.API + '/user/emails/', {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': token
                        }
                    }).then(function (res) {
                        if (res.status === 200) {
                            var emailArrays = res.data.data;
                            for(var i = 0; i < emailArrays.length ; i++){
                                if(emailArrays[i].verified == true){
                                    emailVerified = true;
                                    break;
                                }
                            }
                            cb(null,emailVerified);
                        }
                    }).catch(function (error) {
                        cb(error,null);
                        errorHandler.handleErrors(error);
                    });
                } else {
                    cb(null,false);
                }
            }
        }
    }

})();
