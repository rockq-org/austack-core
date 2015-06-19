/**
 * @ngdoc controller
 * @name sidebar.controller:SidebarController
 * @description
 * The controller for the main menu
 *
 */

(function () {
  'use strict';

  // register the controller as SidebarController
  angular
    .module('austackApp.sidebar')
    .controller('SidebarController', SidebarController);


  /**
   * @ngdoc function
   * @name sidebar.provider:SidebarController
   * @description
   * Provider of the {@link sidebar.controller:SidebarController SidebarController}
   * @param {Service} $rootScope The rootScope service to use
   * @param {Service} sidebar The sidebar service to use
   * @param {Service} $mdSidenav The mdSidenav service to use
   * @param {Service} _ The lodash service to use
   * @returns {Service} {@link sidebar.controller:SidebarController SidebarController}
   */

  SidebarController.$inject = ['sidebar', '$mdSidenav', '_', 'Auth'];


  function SidebarController(sidebar, $mdSidenav, _, Auth) {
    var vm = this;

    // view model bindings
    vm.sidenavId = 'sidebar';
    vm.items = _.sortBy(sidebar.getMenu(), 'order');
    vm.close = close;
    vm.canAccess = canAccess;

    function close() {
      return $mdSidenav(vm.sidenavId).close();
    }

    /**
     * Check if the current user can access the menu item
     * @param {Object} menuItem
     */
    function canAccess(menuItem) {
      if (menuItem.role) {
        return Auth.hasRole(menuItem.role);
      }

      return true;
    }
  }

})();
