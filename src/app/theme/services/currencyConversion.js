(function () {
    'use strict';

    angular.module('BlurAdmin.theme')
        .service('currencyModifiers', currencyModifiers)
        .filter('currencyModifiersFilter', currencyModifiersFilter)
        .filter('tierLimitDecimalFix', tierLimitDecimalFix);

    /** @ngInject */
    function currencyModifiers(Big) {

        return {
            convertToCents: function (amount,divisibility) {
                if(!amount){
                    amount = 0;
                }

                if(!divisibility || (divisibility == 0)){
                    return amount;
                }

                var x = new Big(amount);
                var z = new Big(10);
                z = z.pow(divisibility);
                z = z.toFixed(0);
                var m = x.times(z);
                return  m.toFixed(0);
            },
            convertFromCents: function (amount,divisibility) {
                if(!amount){
                    amount = 0;
                }

                if(!divisibility || (divisibility == 0)){
                    return amount;
                }

                var j = new Big(amount);
                var l = new Big(10);
                l = l.pow(divisibility);
                l = l.toFixed(0);
                var n = j.div(l);
                return n.toFixed(divisibility);
            },
            validateCurrency: function (amount,divisibility) {
                if(!amount){
                    amount = 0;
                }

                if(!divisibility || (divisibility == 0)){
                    return true;
                }

                var amountInArray = amount.toString().split('.');
                var afterDecimalValue = amountInArray[1];
                if(afterDecimalValue == undefined){
                    return true;
                }
                return afterDecimalValue.length > divisibility ? false : true;
            }
        }
    }

    function currencyModifiersFilter(){
        return function (amount,divisibility){
            if(!amount){
                amount = 0;
            }

            if(!divisibility || (divisibility == 0)){
                return amount;
            }

            var q = new Big(amount);
            var w = new Big(10);
            w = w.pow(divisibility);
            w = w.toFixed(0);
            var e = q.div(w);
            return e.toFixed(divisibility);
        }
    }

    function  tierLimitDecimalFix(){
        return function(amount,divisibility){
           if(!amount){
                amount = 0;
            }
            if(!divisibility || (divisibility == 0)){
                return amount.toFixed(2);
            }

            divisibility = Math.pow(10, divisibility);
            var integerPart = (amount / divisibility).toFixed(0);
            var decimalPart = "";

            if(integerPart == 0){
                var arr = new Big(amount / divisibility);
                var leadingZeros = Math.abs(arr.e) - 1;

                for(; leadingZeros > 0; --leadingZeros){
                    decimalPart += '0';
                }

                arr.c.forEach(function(digit){
                    decimalPart += digit;
                });

                switch(decimalPart.length){
                    case 0: return integerPart + ".00";
                    case 1: return integerPart + '.' + decimalPart + '0';
                    default: {
                        return integerPart + '.' + decimalPart;
                    }
                }
            }
            else{
                var arr = new Big(amount);
                for(var i = 0; i < integerPart.toString().length; ++i){
                    arr.c.splice(0, 1);
                }

                switch(arr.c.length){
                    case 0: return integerPart + ".00";
                    case 1: return integerPart + "." + arr.c[0] + "0";
                    default: {
                        arr.c.forEach(function(digit){
                            decimalPart += digit;
                        });

                        return integerPart + '.' + decimalPart;
                    }
                }
            }
        }
    }
})();