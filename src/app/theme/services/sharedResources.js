(function () {
    'use strict';

    angular.module('BlurAdmin.theme')
        .service('sharedResources', sharedResources);

    /** @ngInject */
    function sharedResources(Rehive) {

        return {
            getSubtypes : function () {
                return Rehive.admin.subtypes.get();
            }
        };
    }

})();
