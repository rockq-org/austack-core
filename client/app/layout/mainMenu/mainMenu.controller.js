/**
 * @ngdoc controller
 * @name mainMenu.controller:SidebarController
 * @description
 * The controller for the main menu
 *
 */

(function () {
  'use strict';

  // register the controller as SidebarController
  angular
    .module('austackApp.mainMenu')
    .controller('SidebarController', SidebarController);

  /**
   * @ngdoc function
   * @name mainMenu.provider:SidebarController
   * @description
   * Provider of the {@link mainMenu.controller:SidebarController SidebarController}
   * @param {Service} $rootScope The rootScope service to use
   * @param {Service} mainMenu The mainMenu service to use
   * @param {Service} $mdSidenav The mdSidenav service to use
   * @param {Service} _ The lodash service to use
   * @returns {Service} {@link mainMenu.controller:SidebarController SidebarController}
   */

  SidebarController.$inject = ['$state', 'mainMenu', '$mdSidenav', '_', 'Auth'];

  function SidebarController($state, mainMenu, $mdSidenav, _, Auth) {
    var vm = this;

    // view model bindings
    vm.state = $state;
    vm.sidenavId = 'mainMenu';
    vm.items = _.sortBy(mainMenu.getMenu(), 'order');
    vm.close = close;
    vm.canAccess = canAccess;
    vm.isActive = isActive;

    function isActive(state) {
      var root = state.split('.')[0];
      return $state.includes(root)
    }

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
