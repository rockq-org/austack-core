(function () {
  'use strict';

  /**
   * Register the edit controller as ApplicationSettingsController
   */

  angular
    .module('austackApp.application.detail.settings')
    .controller('ApplicationSettingsController', ApplicationSettingsController);

  // add ApplicationSettingsController dependencies to inject
  ApplicationSettingsController.$inject = ['$state', '$mdDialog', 'Toast', 'application', 'ApplicationService'];

  /**
   * ApplicationSettingsController constructor
   */
  function ApplicationSettingsController($state, $mdDialog, Toast, application, ApplicationService) {
    var vm = this;

    // the current application to display
    vm.application = application;
    vm.name = application.name;
    vm.refreshSecret = refreshSecret;
    vm.update = updateSettings;
    vm.remove = remove;

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
          $state.go('application.list');
        })
        .catch(function () {
          Toast.show('删除应用失败');
        });
    }

    function remove(ev) {
      var confirm = $mdDialog.confirm()
        .title('删除应用 ' + vm.name + '?')
        .content('您确定要删除应用 ' + vm.name + '?')
        .ariaLabel('删除应用')
        .ok('删除应用')
        .cancel('取消')
        .targetEvent(ev);

      $mdDialog.show(confirm)
        .then(deleteApplication);
    }
  }
})();
