(function () {
  'use strict';

  /**
   * Introduce the austackApp.admin.user.list module
   * and configure it.
   *
   * @requires ui.router
   * @requires ngMaterial
   * @requires {austackApp.socket}
   * @requires austackApp.sidebar
   * @requires components/toggleComponent
   * @requires austackApp.admin.user.list.detail
   * @requires austackApp.admin.user.list.edit
   * @requires austackApp.admin.user.list.items
   */

  angular
    .module('austackApp.admin.user.list', [
      'ngMaterial',
      'ui.router',
      'austackApp.socket',
      'austackApp.sidebar',
      'austackApp.toggleComponent',
      'austackApp.admin.user.list.detail',
      'austackApp.admin.user.list.edit',
      'austackApp.admin.user.list.items'
    ])
    .config(configUserListRoutes);

  // inject configUserListRoutes dependencies
  configUserListRoutes.$inject = ['$stateProvider', 'sidebarProvider'];

  /**
   * Route configuration function configuring the passed $stateProvider.
   * Register the user.list state with the list template fpr the
   * 'main' view paired with the UserListController as 'list'.
   *
   * @param {$stateProvider} $stateProvider - The state provider to configure
   */
  function configUserListRoutes($stateProvider, sidebarProvider) {
    // The list state configuration
    var listState = {
      name: 'admin.user.list',
      parent: 'admin.user',
      url: '/',
      authenticate: true,
      role: 'admin',
      resolve: {
        users: resolveUsers
      },
      views: {

        // target the unnamed view in the user state
        '@admin.user': {
          templateUrl: 'app/admin/user/list/list.html',
          controller: 'UserListController',
          controllerAs: 'list'
        },

        // target the content view in the admin.user.list state
        'content@admin.user.list': {
          templateUrl: 'app/admin/user/list/items/items.html',
          controller: 'UserItemsController',
          controllerAs: 'items'
        }
      },
      ncyBreadcrumb: {
        label: 'User'
      }
    };

    $stateProvider.state(listState);

    sidebarProvider.addSubMenuItem('admin.main', {
      name: 'Users',
      state: listState.name,
      order: Infinity
    });
  }

  // inject resolveUsers dependencies
  resolveUsers.$inject = ['User'];

  /**
   * Resolve dependencies for the admin.user.list state
   *
   * @params {User} User - The service to query users
   * @returns {Promise} A promise that, when fullfilled, returns an array of users
   */
  function resolveUsers(User) {
    return User.query().$promise;
  }

})();
