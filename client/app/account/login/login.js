(function () {
  'use strict';

  /**
   * Introduce the austackApp.account.login module
   * and configure it.
   *
   * @requires {ui.router}
   */

  angular
    .module('austackApp.account.login', [
      'ui.router',
      'austackApp.sidebar',
      'austackApp.layout'
    ])
    .config(configAccountLogin);

  // inject configAccountLogin dependencies
  configAccountLogin.$inject = ['$stateProvider', 'sidebarProvider'];

  /**
   * Route configuration function configuring the passed $stateProvider.
   * Register the user.login state with the list template for the
   * 'login' view paired with the UserMainController as 'login'.
   *
   * @param {$stateProvider} $stateProvider - The state provider to configure
   * @param {sidebarProvider} sidebarProvider - The service to pass navigation information to
   */
  function configAccountLogin($stateProvider, sidebarProvider) {
    // The login state configuration
    var loginState = {
      name: 'account.login',
      url: '^/login',
      authenticate: false,
      role: 'anonymous',
      templateUrl: 'app/account/login/login.html',
      controller: 'AccountLoginController',
      controllerAs: 'login',
      ncyBreadcrumb: {
        label: 'Login'
      }
    };

    $stateProvider.state(loginState);

    // sidebarProvider.addMenuItem({
    //   name: 'Login',
    //   state: loginState.name,
    //   role: loginState.role
    // });
  }

})();
