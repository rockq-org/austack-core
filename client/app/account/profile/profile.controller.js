(function () {
  'use strict';

  angular
    .module('austackApp.account')
    .controller('ProfileController', ProfileController);

  ProfileController.$inject = ['$mdDialog'];

  function ProfileController($mdDialog) {
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
