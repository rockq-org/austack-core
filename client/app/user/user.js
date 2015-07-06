(function () {
  'use strict';

  /**
   * Introduce the austackApp.user module
   * and configure it.
   *
   * @requires ngResource
   * @requires ui.router
   * @requires {austackApp.admin.user.list}
   * @requires {austackApp.admin.user.create}
   */
  angular
    .module('austackApp.user', [
      'ngResource',
      'ui.router',
      'austackApp.user.list',
      'austackApp.user.detail',
      'austackApp.user.edit',
      'austackApp.user.create'
    ])
    .config(configUserRoutes);

  // inject configUserRoutes dependencies
  configUserRoutes.$inject = ['$urlRouterProvider', '$stateProvider'];

  /**
   * Route configuration function configuring the passed $stateProvider.
   * Register the abstract user state with the user template
   * paired with the UserController as 'index'.
   * The injectable 'users' is resolved as a list of all users
   * and can be injected in all sub controllers.
   *
   * @param {$urlRouterProvider} $urlRouterProvider - The URL router provider to redirect to the main state
   * @param {$stateProvider} $stateProvider - The state provider to configure
   */
  function configUserRoutes($urlRouterProvider, $stateProvider) {
    // The user state configuration
    var userState = {
      name: 'user',
      parent: 'root',
      url: '/users',
      abstract: true,
      templateUrl: 'app/user/user.html',
      controller: 'UserController',
      controllerAs: 'index',
      resolve: {
        users: resolveUsers
      },
      ncyBreadcrumb: {
        label: '用户'
      }
    };

    $stateProvider.state(userState);
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
