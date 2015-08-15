/**
 * @ngdoc controller
 * @name austackApp.controller:AppController
 * @description
 * This is the application wide controller of the austackApp application
 */

(function () {
  'use strict';

  // register the controller as AppController
  angular
    .module('austackApp')
    .controller('AppController', AppController);

  /**
   * @ngdoc function
   * @name austackApp.provider:AppController
   * @description
   * Provider of the {@link austackApp.controller:AppController AppController}
   *
   * @param {Auth} Auth - The authentication service used for logging out
   * @param {$location} $mdSidenav - The sidenav service used to communicate with the sidenav components
   */

  AppController.$inject = ['Auth', '$mdSidenav'];

  function AppController(Auth, $mdSidenav) {
    var vm = this;

    /**
     * @ngdoc function
     * @name logout
     * @methodOf austackApp.controller:AppController
     * @description
     * Logout the current user
     */
    vm.logout = Auth.logout;

    /**
     * @ngdoc function
     * @name isLoggedIn
     * @methodOf austackApp.controller:AppController
     * @description
     * See {@link components/auth.service:Auth#isLoggedIn isLoggedIn} of the Auth service
     */
    vm.isLoggedIn = Auth.isLoggedIn;
  }
})();
