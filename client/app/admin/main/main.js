(function () {
  'use strict';

  /**
   * Introduce the austackApp.admin.main module
   * and configure it.
   *
   * @requires {ui.router}
   */

  angular
    .module('austackApp.admin.main', [
      'ui.router',
      'austackApp.sidebar',
      'austackApp.layout'
    ])
    .config(configAdminMain);

  // inject configAdminMain dependencies
  configAdminMain.$inject = ['$stateProvider', 'sidebarProvider'];

  /**
   * Route configuration function configuring the passed $stateProvider.
   * Register the user.main state with the list template for the
   * 'main' view paired with the UserMainController as 'main'.
   *
   * @param {$stateProvider} $stateProvider - The state provider to configure
   * @param {sidebarProvider} sidebarProvider - The service to pass navigation information to
   */
  function configAdminMain($stateProvider, sidebarProvider) {
    // The main state configuration
    var mainState = {
      name: 'root.admin.main',
      url: '/admin',
      authenticate: true,
      role: 'admin',
      templateUrl: 'app/admin/main/main.html',
      controller: 'AdminMainController',
      controllerAs: 'main'
    };

    $stateProvider.state(mainState);

    sidebarProvider.addMenuItem({
      name: 'Administration',
      state: mainState.name,
      role: 'admin'
    });
  }

})();
