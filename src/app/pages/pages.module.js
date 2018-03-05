/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages', [
      'ui.router',
      'BlurAdmin.pages.changePassword',
      'BlurAdmin.pages.multiFactorAuth',
      'BlurAdmin.pages.smsAuth',
      'BlurAdmin.pages.multiFactorAuthVerify',
      'BlurAdmin.pages.settings',
      'BlurAdmin.pages.addCurrency',
      'BlurAdmin.pages.currencies',
      'BlurAdmin.pages.transactions',
      'BlurAdmin.pages.groups',
      'BlurAdmin.pages.currency',
      'BlurAdmin.pages.webhooks',
      'BlurAdmin.pages.users',
      'BlurAdmin.pages.services',
      'BlurAdmin.pages.login',
      'BlurAdmin.pages.register',
      'BlurAdmin.pages.resetPassword',
      'BlurAdmin.pages.resetPasswordConfirmation',
      'BlurAdmin.pages.verifyAdminEmail',
      'BlurAdmin.pages.accountSettings',
      'BlurAdmin.pages.group',
      'BlurAdmin.pages.groupTiers',
      'BlurAdmin.pages.permissions',
      'BlurAdmin.pages.verification',
      'BlurAdmin.pages.companyInfoRequest',
      'BlurAdmin.pages.welcomeToRehive',
      'BlurAdmin.pages.newCompanySetup',
      'BlurAdmin.pages.buildAFintechApp',
      'BlurAdmin.pages.initialSetupScreen'
  ])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($urlRouterProvider, baSidebarServiceProvider) {
    $urlRouterProvider.otherwise('/currencies');
  }

})();
