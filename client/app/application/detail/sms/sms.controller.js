(function () {
  'use strict';

  /**
   * Register the edit controller as ApplicationSMSController
   */

  angular
    .module('austackApp.application.detail.sms')
    .controller('ApplicationSMSController', ApplicationSMSController);

  // add ApplicationSMSController dependencies to inject
  ApplicationSMSController.$inject = ['$state', 'application'];

  /**
   * ApplicationSMSController constructor
   */
  function ApplicationSMSController($state, application) {
    var vm = this;

    vm.smsTemplates = {
      "reg_sms": "APP_NAME 验证码 %P%，请在五分内注册账号。",
      "reset_pwd_sms": "APP_NAME 验证码 %P%, 请在五分钟内重置密码。",
      "notify_blocked_sms": "APP_NAME 因为XXX，您的账号被冻结，详情联系 XXX"
    };

    // the current application to display
    vm.application = application;
  }
})();
