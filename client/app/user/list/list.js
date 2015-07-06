(function () {
  'use strict';

  /**
   * Introduce the austackApp.admin.user.list module
   * and configure it.
   *
   * @requires ui.router
   * @requires ngMaterial
   * @requires {austackApp.socket}
   * @requires austackApp.mainMenu
   * @requires components/toggleComponent
   * @requires austackApp.admin.user.list.detail
   * @requires austackApp.admin.user.list.edit
   * @requires austackApp.admin.user.list.items
   */

  angular
    .module('austackApp.user.list', [
      'ngMaterial',
      'ui.router',
      'austackApp.socket',
      'austackApp.listImage',
      'austackApp.mainMenu'
    ])
    .config(configUserListRoutes);

  // inject configUserListRoutes dependencies
  configUserListRoutes.$inject = ['$stateProvider', 'mainMenuProvider'];

  /**
   * Route configuration function configuring the passed $stateProvider.
   * Register the user.list state with the list template fpr the
   * 'main' view paired with the UserListController as 'list'.
   *
   * @param {$stateProvider} $stateProvider - The state provider to configure
   */
  function configUserListRoutes($stateProvider, mainMenuProvider) {
    // The list state configuration
    var listState = {
      name: 'user.list',
      parent: 'user',
      url: '/',
      authenticate: true,
      role: 'admin',
      views: {
        '': {
          templateUrl: 'app/user/list/list.html',
          controller: 'UserListController',
          controllerAs: 'list'
        }
      },
      ncyBreadcrumb: {
        label: '用户'
      }
    };

    $stateProvider.state(listState);

    mainMenuProvider.addMenuItem({
      name: '用户',
      state: listState.name,
      icon: 'action:ic_perm_identity_24px',
      order: 3
    });
  }

})();
