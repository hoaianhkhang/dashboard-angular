/**
 * @author Manosh Talukder
 * created on 11.02.2019
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.theme')
        .filter('excludeSelectedCurrencies', excludeSelectedCurrencies);

    /** @ngInject */
    function excludeSelectedCurrencies() {
        return function(list, ngModel, selectList) {
            const listLength = selectList.length;
            let output = [];

            angular.forEach(list, function(listItem){
                var enabled = true;
                for (let index = 0; index < listLength; ++index) {
                    console.log(selectList[index], ngModel, listItem);
                    if(selectList[index].currency.code !== ngModel.code && selectList[index].currency.code === listItem.code){
                        enabled = false;
                        break;
                    }
                }
                if(enabled){
                    output.push(listItem);
                }
            });

            return output;
        };
    }

})();
