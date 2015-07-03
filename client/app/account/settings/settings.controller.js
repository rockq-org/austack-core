(function () {
  'use strict';

  angular
    .module('austackApp.account')
    .controller('SettingsController', SettingsController);

  SettingsController.$inject = ['$mdDialog'];

  function SettingsController($mdDialog) {
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
