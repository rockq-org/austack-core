(function () {
  'use strict';

  /**
   * Register the edit controller as ApplicationSettingsController
   */

  angular
    .module('austackApp.application.detail.settings')
    .controller('ApplicationSettingsController', ApplicationSettingsController);

  // add ApplicationSettingsController dependencies to inject
  ApplicationSettingsController.$inject = ['$state', 'application', 'ApplicationService'];

  /**
   * ApplicationSettingsController constructor
   */
  function ApplicationSettingsController($state, application, ApplicationService) {
    var vm = this;

    // the current application to display
    application.smsTemplate = application.smsTemplate || 'APP_NAME 验证码 %P%，请在五分内注册账号。';
    vm.application = application;
    vm.name = application.name;
    vm.update = updateSettings;
    vm.delete = deleteApplication;

    function updateSettings() {
      vm.application.name = vm.name;
      ApplicationService.update(vm.application);
    }

    function deleteApplication() {
      ApplicationService.remove(vm.application)
    }
  }
})();
