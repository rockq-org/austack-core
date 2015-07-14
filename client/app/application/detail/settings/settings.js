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
    .module('austackApp.application.detail.settings', [
      'ui.router',
      'angularMoment'
    ])
    .config(configureApplicationSettings);

  // inject configApplicationRoutes dependencies
  configureApplicationSettings.$inject = ['$stateProvider'];

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
  function configureApplicationSettings($stateProvider) {
    // The detail state configuration
    var state = {
      name: 'application.detail.settings',
      parent: 'application.detail',
      url: '/settings',
      authenticate: true,
      role: 'admin',
      views: {
        '': {
          templateUrl: 'app/application/detail/settings/settings.html',
          controller: 'ApplicationSettingsController',
          controllerAs: 'detail'
        }
      },
      ncyBreadcrumb: {
        skip: true
      },
      data: {
        tabIdx: 1
      }
    };

    $stateProvider.state(state);
  }

})();
