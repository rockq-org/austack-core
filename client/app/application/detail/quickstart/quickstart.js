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
          controllerAs: 'detail'
        }
      },
      ncyBreadcrumb: {
        skip: true
      },
      resolve: {
        application: resolveApplicationFromArray
      },
      data: {
        tabIdx: 0
      }
    };

    $stateProvider.state(state);
  }

  // inject resolveApplicationFromArray dependencies
  resolveApplicationFromArray.$inject = ['applications', '$stateParams', '_'];

  /**
   * Resolve dependencies for the application.detail state
   *
   * @params {Array} applications - The array of applications
   * @params {Object} $stateParams - The $stateParams to read the application id from
   * @returns {Object|null} The application whose value of the _id property equals $stateParams._id
   */
  function resolveApplicationFromArray(applications, $stateParams, _) {
    return _.find(applications.data, {
      '_id': $stateParams.id
    });
  }

})();
