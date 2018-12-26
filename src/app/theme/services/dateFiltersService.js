(function () {
    'use strict';

    angular.module('BlurAdmin.theme')
        .service('dateFiltersService', dateFiltersService);

    /** @ngInject */
    function dateFiltersService() {

        return {
            evaluatedDates : function (dateFilter) {
                var dateObj = {
                    date__lt: null,
                    date__gt: null
                };

                switch(dateFilter.selectedDateOption) {
                    case 'Is in the last':
                        if(dateFilter.selectedDayIntervalOption == 'days'){
                            dateObj.date__lt = moment().add(1,'days').format('YYYY-MM-DD');
                            dateObj.date__gt = moment().subtract(dateFilter.dayInterval,'days').format('YYYY-MM-DD');
                        } else {
                            dateObj.date__lt = moment().add(1,'days').format('YYYY-MM-DD');
                            dateObj.date__gt = moment().subtract(dateFilter.dayInterval,'months').format('YYYY-MM-DD');
                        }

                        break;
                    case 'In between':
                        dateObj.date__lt = moment(new Date(dateFilter.dateTo)).add(1,'days').format('YYYY-MM-DD');
                        dateObj.date__gt = moment(new Date(dateFilter.dateFrom)).format('YYYY-MM-DD');

                        break;
                    case 'Is equal to':
                        dateObj.date__lt = moment(new Date(dateFilter.dateEqualTo)).add(1,'days').format('YYYY-MM-DD');
                        dateObj.date__gt = moment(new Date(dateFilter.dateEqualTo)).format('YYYY-MM-DD');

                        break;
                    case 'Is after':
                        dateObj.date__lt = null;
                        dateObj.date__gt = moment(new Date(dateFilter.dateFrom)).add(1,'days').format('YYYY-MM-DD');
                        break;
                    case 'Is before':
                        dateObj.date__lt = moment(new Date(dateFilter.dateTo)).format('YYYY-MM-DD');
                        dateObj.date__gt = null;
                        break;
                    default:
                        break;
                }

                return dateObj;
            }
        };
    }

})();
