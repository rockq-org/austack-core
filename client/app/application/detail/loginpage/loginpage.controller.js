(function () {
  'use strict';

  /**
   * Register the edit controller as ApplicationLoginpageController
   */

  angular
    .module('austackApp.application.detail.loginpage')
    .controller('ApplicationLoginpageController', ApplicationLoginpageController);

  // add ApplicationLoginpageController dependencies to inject
  ApplicationLoginpageController.$inject = ['$mdDialog', '$mdToast', 'application', 'ApplicationService'];

  /**
   * ApplicationLoginpageController constructor
   */
  function ApplicationLoginpageController($mdDialog, $mdToast, application, ApplicationService) {
    var vm = this;
    var template = 'default template';

    // the current application to display
    vm.application = application;
    vm.template = application.loginTemplate || template;
    vm.preview = preview;
    vm.hideDialog = hideDialog;
    vm.update = updateTemplate;
    vm.discard = discard;
    vm.setDefault = setDefault;

    function preview(ev) {
      var dialog = $mdDialog.show({
        controller: DialogController,
        templateUrl: 'app/Application/detail/loginpage/preview.html',
        parent: angular.element(document.body),
        targetEvent: ev
      });
    }

    function DialogController($scope) {
      $scope.template = vm.template;
      $scope.close = function () {
        $mdDialog.hide();
      };
      $scope.save = vm.update;
    }

    function hideDialog() {
      return $mdDialog.hide();
    }

    function updateTemplate() {
      vm.application.loginTemplate = vm.template;
      ApplicationService.update(vm.application)
        .then(function () {
          $mdToast.show(
            $mdToast.simple()
            .content('登录模板保存成功')
            .position('top right')
            .hideDelay(500)
          );
        })
        .catch(function () {
          $mdToast.show(
            $mdToast.simple()
            .content('登录模板保存失败')
            .position('top right')
            .hideDelay(500)
          );
        });
    }

    function discard() {
      vm.template = application.loginTemplate;
    }

    function setDefault() {
      vm.template = template;
    }
  }
})();
