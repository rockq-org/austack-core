(function () {
  'use strict';

  angular
    .module('austackApp.account.settings')
    .controller('AccountSettingsController', AccountSettingsController);

  AccountSettingsController.$inject = ['$mdDialog'];

  function AccountSettingsController($mdDialog) {
    var vm = this;

    vm.hide = function () {
      $mdDialog.hide();
    };
    vm.cancel = function () {
      $mdDialog.cancel();
    };
    vm.answer = function (answer) {
      $mdDialog.hide(answer);
    };
  }

})();
