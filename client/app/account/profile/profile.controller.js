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
      $mdDialog.hide().then(function () {
        $state.go('settings');
      });
    }

    vm.user.avatar = vm.user.avaar || 'assets/images/profile.png';

    vm.close = function () {
      $mdDialog.hide();
    };
  }

})();
