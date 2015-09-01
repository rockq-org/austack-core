(function () {
  'use strict';

  angular
    .module('austackApp.account')
    .controller('ProfileController', ProfileController);

  ProfileController.$inject = ['$state', '$mdDialog', 'Auth'];

  function ProfileController($state, $mdDialog, Auth) {
    var vm = this;

    vm.user = Auth.getCurrentUser();
    vm.gotoSettings = gotoSettings;

    function gotoSettings() {
      $state.go('settings');
      $mdDialog.hide();
    }

    vm.user.avatar = vm.user.avatar || 'assets/images/profile.png';

    vm.close = function () {
      $mdDialog.hide();
    };
  }

})();
