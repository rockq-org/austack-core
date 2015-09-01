(function () {
  'use strict';

  angular
    .module('austackApp.application.create', [])
    .controller('ApplicationCreateController', ApplicationCreateController);

  ApplicationCreateController.$inject = ['$mdDialog', 'Application', 'ApplicationService', 'Toast'];

  function ApplicationCreateController($mdDialog, Application, ApplicationService, Toast) {
    var vm = this;

    vm.application = new Application();

    vm.create = createApplication;
    vm.close = hideDialog;
    vm.cancel = cancelDialog;

    function createApplication(form) {
      // refuse to work with invalid data
      if (vm.application._id || (form && !form.$valid)) {
        return;
      }

      ApplicationService.create(vm.application)
        .then(createApplicationSuccess)
        .catch(createApplicationCatch);

      function createApplicationSuccess(newApplication) {
        Toast.show({
          type: 'success',
          text: '应用 ' + newApplication.name + ' 创建成功',
          link: {
            state: 'application.detail',
            params: {
              id: newApplication._id
            }
          }
        });
        vm.close();
      }

      function createApplicationCatch(err) {
        if (form && err) {
          form.setResponseErrors(err);
        }

        Toast.show({
          type: 'warn',
          text: '创建应用失败'
        });
      }
    }

    function hideDialog() {
      $mdDialog.hide();
    }

    function cancelDialog() {
      $mdDialog.cancel();
    }
  }
})();
