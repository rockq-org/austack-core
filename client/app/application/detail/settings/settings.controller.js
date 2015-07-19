(function () {
  'use strict';

  /**
   * Register the edit controller as ApplicationSettingsController
   */

  angular
    .module('austackApp.application.detail.settings')
    .controller('ApplicationSettingsController', ApplicationSettingsController);

  // add ApplicationSettingsController dependencies to inject
  ApplicationSettingsController.$inject = ['$state', '$mdToast', 'application', 'ApplicationService'];

  /**
   * ApplicationSettingsController constructor
   */
  function ApplicationSettingsController($state, $mdToast, application, ApplicationService) {
    var vm = this;

    // the current application to display
    application.smsTemplate = application.smsTemplate || 'APP_NAME 验证码 %P%，请在五分内注册账号。';
    vm.application = application;
    vm.name = application.name;
    vm.update = updateSettings;
    vm.delete = deleteApplication;

    function updateSettings() {
      vm.application.name = vm.name;
      ApplicationService.update(vm.application)
        .then(function () {
          $mdToast.show(
            $mdToast.simple()
            .content('应用设置保存成功')
            .position('top right')
            .hideDelay(500)
          );
        })
        .catch(function () {
          $mdToast.show(
            $mdToast.simple()
            .content('应用设置保存失败')
            .position('top right')
            .hideDelay(500)
          );
        });
    }

    function deleteApplication() {
      ApplicationService.remove(vm.application)
        .then(function () {
          $mdToast.show(
            $mdToast.simple()
            .content('删除应用成功')
            .position('top right')
            .hideDelay(500)
          );
        })
        .catch(function () {
          $mdToast.show(
            $mdToast.simple()
            .content('删除应用失败')
            .position('top right')
            .hideDelay(500)
          );
        });
    }
  }
})();
