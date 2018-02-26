import baProgressModalFactory from './services/baProgressModal';
import baUtilService from './services/baUtil';
import bigFactory from './services/big';
import cleanObjectService from './services/cleanObject';
import cookieManagementService from './services/cookieManagement';
import currenciesListService from './services/currenciesList';
import currencyConversionService from './services/currencyConversion';
import errorHandlerService from './services/errorHandler';
import fileReaderService from './services/fileReader';
import identifySearchInputFactory from './services/identifySearchInput';
import localStorageManagementFactory from './services/localStorageManagement';
import metadateTextServiceFactory from './services/metadateTextService';
import preloaderService from './services/preloader';
import serializeFiltersService from './services/serializeFilters';
import sharedResourcesService from './services/sharedResources';
import stopableIntervalService from './services/stopableInterval';
import stringServiceFactory from './services/stringService';
import typeaheadService from './services/typeaheadService';
import underscoreFactory from './services/underscore';
import userVerificationFactory from './services/userVerification';

import blurAdminThemeInputModule from './inputs/inputs.module';

console.log(blurAdminThemeInputModule)

module.exports = angular.module('BlurAdmin.theme', [
    'toastr',
    blurAdminThemeInputModule.name,
    'BlurAdmin.theme.components'
]);

baProgressModalFactory();
bigFactory();
identifySearchInputFactory();
localStorageManagementFactory();
metadateTextServiceFactory();
stringServiceFactory();
underscoreFactory();
userVerificationFactory();
preloaderService();
baUtilService();
cleanObjectService();
cookieManagementService();
currenciesListService();
currencyConversionService();
errorHandlerService();
fileReaderService();
serializeFiltersService();
sharedResourcesService();
stopableIntervalService();
typeaheadService();

