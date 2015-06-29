(function () {
  'use strict';

  /**
   * Introduce the austackApp.account.logout module
   * and configure it.
   *
   * @requires {ui.router}
   */

  angular
    .module('austackApp.account')
    .config(configAccountLogout);

  // inject configAccountLogout dependencies
  configAccountLogout.$inject = ['$stateProvider', 'mainMenuProvider'];

  /**
   * Route configuration function configuring the passed $stateProvider.
   * Register the user.logout state with the list template for the
   * 'logout' view paired with the UserMainController as 'logout'.
   *
   * @param {$stateProvider} $stateProvider - The state provider to configure
   * @param {mainMenuProvider} mainMenuProvider - The service to pass navigation information to
   */
  function configAccountLogout($stateProvider, mainMenuProvider) {
    // The logout state configuration
    var logoutState = {
      name: 'account.logout',
      url: '^/logout',
      authenticate: false,
      role: 'user',
      templateUrl: 'app/account/logout/logout.html',
      controller: 'AccountLogoutController',
      controllerAs: 'logout',
      ncyBreadcrumb: {
        label: 'Logout'
      }
    };

    $stateProvider.state(logoutState);

    // mainMenuProvider.addMenuItem({
    //   name: 'Logout',
    //   state: logoutState.name,
    //   role: logoutState.role
    // });
  }

})();
