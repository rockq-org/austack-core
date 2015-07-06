(function () {
  'use strict';

  // register the controller as UserController
  angular
    .module('austackApp.user')
    .controller('UserController', UserController);

  // add UserController dependencies to inject
  // UserController.$inject = [''];

  /**
   * UserController constructor. Main controller for the austackApp.admin.user
   * module.
   *
   */
  function UserController() {
    // var vm = this;
  }

})();
