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
    .module('austackApp.application.detail.quickstart', [
      'ui.router',
      'austackApp.hljs',
      'angularMoment'
    ])
    .config(configureApplicationQuickstart);

  // inject configApplicationRoutes dependencies
  configureApplicationQuickstart.$inject = ['$stateProvider'];

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
  function configureApplicationQuickstart($stateProvider) {
    // The detail state configuration
    var state = {
      name: 'application.detail.quickstart',
      parent: 'application.detail',
      url: '/quickstart',
      authenticate: true,
      role: 'admin',
      views: {
        '': {
          templateUrl: 'app/application/detail/quickstart/quickstart.html',
          controller: 'ApplicationQuickstartController',
          controllerAs: 'vm'
        }
      },
      ncyBreadcrumb: {
        skip: true
      },
      data: {
        tabIdx: 0
      }
    };

    $stateProvider.state(state);
  }

})();
