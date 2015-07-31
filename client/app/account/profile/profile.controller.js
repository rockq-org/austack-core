(function () {
  'use strict';

  angular
    .module('austackApp.account')
    .controller('ProfileController', ProfileController);

  ProfileController.$inject = ['$mdDialog', 'Auth'];

  function ProfileController($mdDialog, Auth) {
    var vm = this;

    vm.user = Auth.getCurrentUser();

    vm.user.avatar = vm.user.avaar || 'assets/images/profile.png';

    vm.close = function () {
      $mdDialog.hide();
    };
  }

})();
