(function () {
  'use strict';

  /**
   * Register the edit controller as ApplicationSettingsController
   */

  angular
    .module('austackApp.application.detail.settings')
    .controller('ApplicationSettingsController', ApplicationSettingsController);

  // add ApplicationSettingsController dependencies to inject
  ApplicationSettingsController.$inject = ['$state', 'Toast', 'application', 'ApplicationService'];

  /**
   * ApplicationSettingsController constructor
   */
  function ApplicationSettingsController($state, Toast, application, ApplicationService) {
    var vm = this;

    // the current application to display
    vm.application = application;
    vm.name = application.name;
    vm.refreshSecret = refreshSecret;
    vm.update = updateSettings;
    vm.delete = deleteApplication;

    function refreshSecret() {
      ApplicationService.refreshSecret(vm.application)
        .then(function (data) {
          vm.application = data;
          Toast.show('更新令牌成功');
        })
        .catch(function () {
          Toast.show('更新令牌失败');
        });
    }

    function updateSettings() {
      vm.application.name = vm.name;
      ApplicationService.update(vm.application)
        .then(function () {
          Toast.show('应用设置保存成功');
        })
        .catch(function () {
          Toast.show('应用设置保存失败');
        });
    }

    function deleteApplication() {
      ApplicationService.remove(vm.application)
        .then(function () {
          Toast.show('删除应用成功');
        })
        .catch(function () {
          Toast.show('删除应用失败');
        });
    }
  }
})();