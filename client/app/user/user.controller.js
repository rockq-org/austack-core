(function () {
  'use strict';

  // register the controller as UserController
  angular
    .module('austackApp.user')
    .controller('UserController', UserController);

  // add UserController dependencies to inject
  UserController.$inject = ['$mdDialog'];

  /**
   * UserController constructor. Main controller for the austackApp.admin.user
   * module.
   *
   */
  function UserController($mdDialog) {
    var vm = this;

    vm.create = createUser;

    function createUser() {
      $mdDialog.show({
        controller: 'UserCreateController',
        controllerAs: 'create',
        templateUrl: 'app/user/create/create.html',
        clickOutsideToClose: false
      });
    }
  }

})();
