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
    .module('austackApp.application.detail.sms', [
      'ui.router',
      'angularMoment'
    ])
    .config(configureApplicationSMS);

  // inject configApplicationRoutes dependencies
  configureApplicationSMS.$inject = ['$stateProvider'];

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
  function configureApplicationSMS($stateProvider) {
    // The detail state configuration
    var state = {
      name: 'application.detail.sms',
      parent: 'application.detail',
      url: '/sms',
      authenticate: true,
      role: 'admin',
      views: {
        '': {
          templateUrl: 'app/application/detail/sms/sms.html',
          controller: 'ApplicationSMSController',
          controllerAs: 'vm'
        }
      },
      ncyBreadcrumb: {
        skip: true
      },
      data: {
        tabIdx: 3
      }
    };

    $stateProvider.state(state);
  }

})();
