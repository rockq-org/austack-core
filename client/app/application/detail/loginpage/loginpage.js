(function () {
  'use strict';

  /**
   * Introduce the austackApp.application.list.detail submodule
   * and configure it.
   *
   * @requires ui.router
   * @requires angularMoment
   */

  angular
    .module('austackApp.application.detail.loginpage', [
      'ui.router',
      'angularMoment'
    ])
    .config(configureApplicationListDetail);

  // inject configApplicationRoutes dependencies
  configureApplicationListDetail.$inject = ['$stateProvider'];

  /**
   * Route configuration function configuring the passed $stateProvider.
   * Register the 'application.detail' state with the detail template
   * paired with the ApplicationDetailController as 'detail' for the
   * 'sidenav' sub view.
   * 'application' is resolved as the application with the id found in
   * the state parameters.
   *
   * @param {$stateProvider} $stateProvider - The state provider to configure
   */
  function configureApplicationListDetail($stateProvider) {
    // The detail state configuration
    var state = {
      name: 'application.detail.loginpage',
      parent: 'application.detail',
      url: '/loginpage',
      authenticate: true,
      role: 'admin',
      views: {
        '': {
          templateUrl: 'app/application/detail/loginpage/loginpage.html',
          controller: 'ApplicationLoginpageController',
          controllerAs: 'vm'
        }
      },
      ncyBreadcrumb: {
        skip: true
      },
      data: {
        tabIdx: 2
      }
    };

    $stateProvider.state(state);
  }

})();
